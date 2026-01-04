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
    const uniqueCategories = useMemo(() => {
        const allCats = products.flatMap(p => p.categories || []);
        return Array.from(new Set(allCats)).sort();
    }, [products]);

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
            // 1. Category Filter (OR Logic / Single Select Check)
            // If "All" is selected, show all.
            // Otherwise, check if the product's categories array INCLUDES the selected category.
            // Using case-insensitive check for robustness, assuming product categories are lowercase or normalized.
            const matchesCategory =
                activeCategory === "All" ||
                (product.categories && product.categories.some(cat => cat.toLowerCase() === activeCategory.toLowerCase()));

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
                case "featured":
                default:
                    // Featured first (true > false/undefined)
                    const isFeaturedA = !!a.featured;
                    const isFeaturedB = !!b.featured;

                    if (isFeaturedA !== isFeaturedB) {
                        return isFeaturedA ? -1 : 1;
                    }

                    // Secondary sort: Newest (created_at desc)
                    // Use string comparison for ISO dates
                    return b.createdAt.localeCompare(a.createdAt);
            }
        });
    }, [filteredProducts, sortBy]);

    // Derived Active Filters
    const activeFilters = useMemo(() => {
        const filters = [];

        if (activeCategory !== "All") {
            filters.push({
                id: "category",
                label: capitalize(activeCategory),
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
        // Load More logic: Show from 0 up to current page * limit
        return sortedProducts.slice(0, currentPage * ITEMS_PER_PAGE);
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
                <div className="flex flex-col items-center text-center mt-8 mb-16">
                    <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-[0.2em] text-gray-900 uppercase">
                        The Collection
                    </h1>
                    <div className="h-px w-24 bg-gray-200 mt-8 mb-4"></div>
                    <p className="max-w-xl text-sm md:text-base text-gray-500 font-light tracking-wide">
                        Timeless comfort, elevated style.
                    </p>
                </div>

                {/* Controls Bar: Minimalist Single Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full mb-12 border-b border-gray-100 pb-4">

                    {/* Search (Left aligned for balance or keep with tools?) 
                        Let's keep the user's current pattern but consolidated. 
                        Actually, moving Search to the left might be nice, but let's keep all checks together for now, 
                        OR simplify the container to just be the tools since the "Left" part is gone.
                    */}
                    <div className="w-full flex items-center justify-between">
                        {/* Search Left */}
                        <div className={`relative transition-all duration-300 ${searchQuery ? "w-full md:w-64" : "w-auto"}`}>
                            {searchQuery ? (
                                <div className="relative w-full flex items-center border-b border-gray-300 focus-within:border-gray-900">
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full bg-transparent py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                                        placeholder="Search styles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        onClick={() => { setSearchQuery(""); setDebouncedQuery(""); }}
                                        className="absolute right-0 text-gray-400 hover:text-gray-900"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSearchQuery(" ")}
                                    className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
                                    aria-label="Open search"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="hidden md:inline">Search</span>
                                </button>
                            )}
                        </div>

                        {/* Filters Right (Category, Sort, Price) */}
                        <div className="flex items-center gap-4 md:gap-8">
                            {/* Category Dropdown (New Unified Control) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1">
                                        Category
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-none border border-gray-100 p-0 max-h-[60vh] overflow-y-auto">
                                    <DropdownMenuItem
                                        onClick={() => setActiveCategory("All")}
                                        className={`
                                            flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider cursor-pointer transition-colors rounded-none
                                            ${activeCategory === "All" ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                        `}
                                    >
                                        All Categories
                                        {activeCategory === "All" && <Check className="h-3 w-3" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-0 bg-gray-100" />
                                    {uniqueCategories.map((category) => (
                                        <DropdownMenuItem
                                            key={category}
                                            onClick={() => setActiveCategory(category)}
                                            className={`
                                                flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider cursor-pointer transition-colors rounded-none
                                                ${activeCategory === category ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                            `}
                                        >
                                            {capitalize(category)}
                                            {activeCategory === category && <Check className="h-3 w-3" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Sort */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1">
                                        Sort
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-none border border-gray-100 p-0">
                                    {SORT_OPTIONS.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`
                                                flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider cursor-pointer transition-colors rounded-none
                                                ${sortBy === option.value ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                            `}
                                        >
                                            {option.label}
                                            {sortBy === option.value && <Check className="h-3 w-3" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Filter (Price) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1">
                                        Price
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-none border border-gray-100 p-0">
                                    {PRICE_RANGES.map((range) => (
                                        <DropdownMenuItem
                                            key={range.value}
                                            onClick={() => setPriceRange(range.value)}
                                            className={`
                                                flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider cursor-pointer transition-colors rounded-none
                                                ${priceRange === range.value ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                            `}
                                        >
                                            {range.label}
                                            {priceRange === range.value && <Check className="h-3 w-3" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips (Minimal) */}
                {activeFilters.length > 0 && (
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        {activeFilters.map((filter) => (
                            <span
                                key={filter.id}
                                className="inline-flex items-center gap-2 border border-gray-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-900 transition-colors"
                            >
                                {filter.label}
                                <button
                                    onClick={filter.onRemove}
                                    className="hover:text-gray-500 focus:outline-none"
                                    aria-label={`Remove ${filter.label} filter`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={handleClearAll}
                            className="text-xs font-medium uppercase tracking-wide text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Grid - 2 cols mobile, 4 desktop */}
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
                    {paginatedProducts.map((product) => ( // paginatedProducts logic updated below to slice(0, end)
                        <ShoeCard key={product.id} product={product} />
                    ))}
                </div>

                {/* "Pagination" -> Load More */}
                {paginatedProducts.length < sortedProducts.length && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-gray-900 pb-1 hover:opacity-60 transition-opacity"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="mt-20 text-center py-20 border-t border-gray-100">
                        <p className="text-gray-900 font-medium uppercase tracking-widest text-sm mb-4">
                            No styles match your selection
                        </p>
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-4"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </Container>
        </div>
    );
}
