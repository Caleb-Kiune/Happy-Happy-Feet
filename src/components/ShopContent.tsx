"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Container from "@/components/Container";
import ShoeCard from "@/components/ShoeCard";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Search, X, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Sort Options
const SORT_OPTIONS = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-asc" },
];

// Price Ranges
const PRICE_RANGES = [
    { label: "All Prices", value: "all" },
    { label: "Under KSh 4,000", value: "under-4000" },
    { label: "KSh 4,000 – 6,000", value: "4000-6000" },
    { label: "Over KSh 6,000", value: "over-6000" },
];

const ITEMS_PER_PAGE = 24;

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

type ShopContentProps = {
    products: Product[];
};

export default function ShopContent({ products }: ShopContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Derive unique categories from products
    const uniqueCategories = useMemo(() =>
        Array.from(new Set(products.map((p) => p.category))),
        [products]
    );
    const CATEGORIES = useMemo(() =>
        ["All", ...uniqueCategories.map(capitalize)],
        [uniqueCategories]
    );

    // Initialize state from URL params or defaults
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
    const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Category
        if (activeCategory === "All") {
            params.delete("category");
        } else {
            params.set("category", activeCategory);
        }

        // Search
        if (debouncedQuery) {
            params.set("search", debouncedQuery);
        } else {
            params.delete("search");
        }

        // Sort
        if (sortBy === "featured") {
            params.delete("sort");
        } else {
            params.set("sort", sortBy);
        }

        // Price
        if (priceRange === "all") {
            params.delete("price");
        } else {
            params.set("price", priceRange);
        }

        // Page
        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        } else {
            params.delete("page");
        }

        // Update URL
        if (params.toString() !== searchParams.toString()) {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [activeCategory, debouncedQuery, sortBy, priceRange, currentPage, pathname, router, searchParams]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, debouncedQuery, priceRange, sortBy]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // 1. Category Filter
            const matchesCategory =
                activeCategory === "All" ||
                product.category.toLowerCase() === activeCategory.toLowerCase();

            // 2. Search Filter (Name or Description)
            const q = debouncedQuery.toLowerCase();
            const matchesSearch =
                product.name.toLowerCase().includes(q) ||
                (product.description && product.description.toLowerCase().includes(q));

            // 3. Price Filter
            let matchesPrice = true;
            const price = product.price;
            if (priceRange === "under-4000") matchesPrice = price < 4000;
            else if (priceRange === "4000-6000") matchesPrice = price >= 4000 && price <= 6000;
            else if (priceRange === "over-6000") matchesPrice = price > 6000;

            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [products, activeCategory, debouncedQuery, priceRange]);

    // Sort products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                default:
                    return 0; // Keep original order for "featured"
            }
        });
    }, [filteredProducts, sortBy]);

    // Derived Active Filters
    const activeFilters = useMemo(() => {
        const filters = [];

        if (activeCategory !== "All") {
            filters.push({
                id: "category",
                label: activeCategory,
                onRemove: () => setActiveCategory("All"),
            });
        }

        if (searchQuery) {
            filters.push({
                id: "search",
                label: `Search: "${searchQuery}"`,
                onRemove: () => {
                    setSearchQuery("");
                    setDebouncedQuery("");
                },
            });
        }

        if (sortBy !== "featured") {
            const label = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;
            filters.push({
                id: "sort",
                label: label,
                onRemove: () => setSortBy("featured"),
            });
        }

        if (priceRange !== "all") {
            const label = PRICE_RANGES.find((r) => r.value === priceRange)?.label;
            filters.push({
                id: "price",
                label: label,
                onRemove: () => setPriceRange("all"),
            });
        }

        return filters;
    }, [activeCategory, searchQuery, sortBy, priceRange]);

    const handleClearAll = () => {
        setActiveCategory("All");
        setSearchQuery("");
        setDebouncedQuery("");
        setSortBy("featured");
        setPriceRange("all");
    };


    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, sortedProducts]);

    // Handle out of bounds
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="bg-white pb-24 pt-16 md:pt-24">
            <Container>
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <h1 className="font-sans text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                        Our Collection
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-gray-500">
                        Explore our latest styles, designed for every occasion.
                    </p>
                </div>

                {/* Search & Sort Bar */}
                <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4 w-full px-4 max-w-2xl mx-auto">
                    {/* Search */}
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-full border-0 py-3 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-500 sm:text-sm sm:leading-6 bg-white"
                            placeholder="Search shoes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="relative flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-accent-500 transition-colors focus:outline-none">
                                    Sort & Filter
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl rounded-xl border-gray-100 p-2">
                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">Sort By</DropdownMenuLabel>
                                {SORT_OPTIONS.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={`
                                            flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors
                                            ${sortBy === option.value ? "bg-accent-50 text-accent-600" : "text-gray-700 focus:bg-gray-50 focus:text-gray-900"}
                                        `}
                                    >
                                        {option.label}
                                        {sortBy === option.value && <Check className="h-4 w-4 text-accent-500" />}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">Price Range</DropdownMenuLabel>
                                {PRICE_RANGES.map((range) => (
                                    <DropdownMenuItem
                                        key={range.value}
                                        onClick={() => setPriceRange(range.value)}
                                        className={`
                                            flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors
                                            ${priceRange === range.value ? "bg-accent-50 text-accent-600" : "text-gray-700 focus:bg-gray-50 focus:text-gray-900"}
                                        `}
                                    >
                                        {range.label}
                                        {priceRange === range.value && <Check className="h-4 w-4 text-accent-500" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilters.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        {activeFilters.map((filter) => (
                            <span
                                key={filter.id}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
                            >
                                <span className="max-w-[200px] truncate">{filter.label}</span>
                                <button
                                    onClick={filter.onRemove}
                                    className="ml-0.5 rounded-full p-0.5 hover:bg-gray-300/50 hover:text-gray-700 focus:outline-none"
                                    aria-label={`Remove ${filter.label} filter`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}

                        {activeFilters.length >= 2 && (
                            <button
                                onClick={handleClearAll}
                                className="ml-2 text-sm font-medium text-accent-500 hover:text-accent-600 hover:underline transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}

                {/* Categories */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? "default" : "outline"}
                            onClick={() => setActiveCategory(category)}
                            className={`min-w-[80px] rounded-full px-6 transition-all ${activeCategory === category
                                ? "bg-accent-500 hover:bg-accent-600 text-white border-transparent"
                                : "border-gray-200 text-gray-600 hover:border-accent-500 hover:text-accent-500"
                                }`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedProducts.map((product) => (
                        <ShoeCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16 flex flex-col items-center gap-4 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-10 w-10 rounded-full"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${currentPage === page
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-10 w-10 rounded-full"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–
                            <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)}</span> of{" "}
                            <span className="font-medium">{sortedProducts.length}</span> results
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="mt-20 text-center">
                        <p className="text-gray-500">
                            {debouncedQuery
                                ? `No products found for "${debouncedQuery}" ${activeCategory !== "All" ? `in ${activeCategory}` : ""
                                }.`
                                : "No products found in this category."}
                        </p>
                        {debouncedQuery && (
                            <Button
                                variant="link"
                                onClick={() => setSearchQuery("")}
                                className="mt-2 text-accent-500 hover:text-accent-600"
                            >
                                Clear search
                            </Button>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
}
