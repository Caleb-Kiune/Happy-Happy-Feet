"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Container from "@/components/Container";
import ShopHero from "@/components/ShopHero";
import ShopCategoryBar from "@/components/ShopCategoryBar";
import ShoeCard from "@/components/ShoeCard";
import { Product } from "@/lib/products";
import { Category } from "@/app/admin/categories/actions";
import { X, Check, ChevronDown } from "lucide-react";
import { useShopSearch } from "@/context/ShopSearchContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
    availableCategories: Category[];
};

export default function ShopContent({ products, availableCategories }: ShopContentProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { searchQuery, setSearchQuery, setLiveSearchEnabled } = useShopSearch();

    // 1. Authoritative Client State (Lazy Init from URL)
    // We only read searchParams ONCE on mount to initialize state.
    // Subsequent updates are driven purely by local state interactions.
    const [filterState, setFilterState] = useState(() => ({
        category: searchParams.get("category") || "All",
        search: searchParams.get("search") || "", // Initialize from URL
        sort: searchParams.get("sort") || "featured",
        price: searchParams.get("price") || "all",
        page: Number(searchParams.get("page")) || 1
    }));

    // 2. Refs for Diff Tracking (Used for History Management)
    const prevCategoryRef = useRef(filterState.category);

    // Dataset Guardrail: If products > 1000, disable live search
    useEffect(() => {
        if (products.length > 1000) {
            setLiveSearchEnabled(false);
        } else {
            setLiveSearchEnabled(true);
        }
    }, [products.length, setLiveSearchEnabled]);

    // Sync Initial URL Search to Global Context (Once on Mount)
    useEffect(() => {
        const initialSearch = searchParams.get("search");
        if (initialSearch) {
            setSearchQuery(initialSearch);
        }
    }, []); // Only on mount

    // Sync Global Context Search -> Local State
    useEffect(() => {
        if (searchQuery !== filterState.search) {
            setFilterState(prev => ({ ...prev, search: searchQuery, page: 1 }));
        }
    }, [searchQuery, filterState.search]);


    // 3. Helper to update state (Optimistic & Instant)
    const updateFilter = (updates: Partial<typeof filterState>) => {
        setFilterState(prev => {
            // Reset page to 1 if any filter (category, search, sort, price) changes
            // Only keep current page if the update is explicitly mostly about pagination
            const isPagination = Object.keys(updates).length === 1 && updates.hasOwnProperty("page");
            const newPage = isPagination ? (updates.page ?? 1) : 1;

            return {
                ...prev,
                ...updates,
                page: newPage
            };
        });
    };

    // 4. URL Sync Side Effect (Background)
    useEffect(() => {
        const params = new URLSearchParams();
        const { category, search, sort, price, page } = filterState;

        // Clean URLs: Only add params if they differ from defaults
        if (category && category !== "All") params.set("category", category);
        if (search) params.set("search", search);
        if (sort && sort !== "featured") params.set("sort", sort);
        if (price && price !== "all") params.set("price", price);
        if (page > 1) params.set("page", page.toString());

        const queryString = params.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;

        // Detect if category changed for pushState (Navigation feel)
        const isCategoryChange = category !== prevCategoryRef.current;
        prevCategoryRef.current = category;

        // Use standard History API to avoid Next.js server round-trips for filters
        if (isCategoryChange) {
            window.history.pushState(null, "", url);
        } else {
            window.history.replaceState(null, "", url);
        }

    }, [filterState, pathname]);


    // 5. Memoized Filtering Logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const { category, search, price } = filterState;

            // 1. Category Filter
            const matchesCategory =
                category === "All" ||
                (product.categories && product.categories.some(cat => cat.toLowerCase() === category.toLowerCase()));

            // 2. Search Filter
            const q = search.toLowerCase();
            const matchesSearch =
                !q ||
                product.name.toLowerCase().includes(q) ||
                (product.description && product.description.toLowerCase().includes(q));

            // 3. Price Filter
            let matchesPrice = true;
            const p = product.price;
            if (price === "under-4000") matchesPrice = p < 4000;
            else if (price === "4000-6000") matchesPrice = p >= 4000 && p <= 6000;
            else if (price === "over-6000") matchesPrice = p > 6000;

            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [products, filterState.category, filterState.search, filterState.price]);

    // 6. Memoized Sorting
    const sortedProducts = useMemo(() => {
        const { sort } = filterState;
        return [...filteredProducts].sort((a, b) => {
            switch (sort) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "featured":
                default:
                    const isFeaturedA = !!a.featured;
                    const isFeaturedB = !!b.featured;
                    if (isFeaturedA !== isFeaturedB) return isFeaturedA ? -1 : 1;
                    return b.createdAt.localeCompare(a.createdAt);
            }
        });
    }, [filteredProducts, filterState.sort]);

    // 7. Memoized Pagination
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        return sortedProducts.slice(0, filterState.page * ITEMS_PER_PAGE);
    }, [filterState.page, sortedProducts]);


    // 8. Derived UI State
    const activeFilters = useMemo(() => {
        const filters = [];
        const { category, search, sort, price } = filterState;

        if (category !== "All") {
            filters.push({
                id: "category",
                label: capitalize(category),
                onRemove: () => updateFilter({ category: "All" }),
            });
        }

        if (search) {
            filters.push({
                id: "search",
                label: `Search: "${search}"`,
                onRemove: () => setSearchQuery(""), // Clear via Context!
            });
        }

        if (sort !== "featured") {
            const label = SORT_OPTIONS.find((o) => o.value === sort)?.label;
            filters.push({
                id: "sort",
                label: label,
                onRemove: () => updateFilter({ sort: "featured" }),
            });
        }

        if (price !== "all") {
            const label = PRICE_RANGES.find((r) => r.value === price)?.label;
            filters.push({
                id: "price",
                label: label,
                onRemove: () => updateFilter({ price: "all" }),
            });
        }

        return filters;
    }, [filterState]);

    const handleClearAll = () => {
        setFilterState({
            category: "All",
            search: "",
            sort: "featured",
            price: "all",
            page: 1
        });
        setSearchQuery(""); // Clear via Context!
    };

    const heroTitle = filterState.category === "All" ? "The Collection" : capitalize(filterState.category);

    return (
        <div className="bg-white pb-24">
            <ShopHero title={heroTitle} />
            <ShopCategoryBar
                categories={availableCategories}
                activeCategory={filterState.category}
                onSelectCategory={(slug) => updateFilter({ category: slug })}
            />
            <Container>
                {/* Controls Bar */}
                <div className="flex flex-row justify-between items-center gap-2 md:gap-4 w-full mb-12 border-b border-gray-100 py-4 overflow-x-auto no-scrollbar">

                    {/* Left: Filter Tools */}
                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                        {/* Price Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1">
                                    Price
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-white shadow-lg rounded-none border border-gray-100 p-0">
                                {PRICE_RANGES.map((range) => (
                                    <DropdownMenuItem
                                        key={range.value}
                                        onClick={() => updateFilter({ price: range.value })}
                                        className={`
                                            flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] cursor-pointer transition-colors rounded-none
                                            ${filterState.price === range.value ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                        `}
                                    >
                                        {range.label}
                                        {filterState.price === range.value && <Check className="h-3 w-3" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Right: Sort Tool */}
                    <div className="flex items-center justify-end shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1">
                                    Sort By
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-none border border-gray-100 p-0">
                                {SORT_OPTIONS.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => updateFilter({ sort: option.value })}
                                        className={`
                                            flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] cursor-pointer transition-colors rounded-none
                                            ${filterState.sort === option.value ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                        `}
                                    >
                                        {option.label}
                                        {filterState.sort === option.value && <Check className="h-3 w-3" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilters.length > 0 && (
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        {activeFilters.map((filter) => (
                            <span
                                key={filter.id}
                                className="inline-flex items-center gap-2 border border-gray-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 transition-colors"
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

                {/* Grid */}
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
                    {paginatedProducts.map((product) => (
                        <ShoeCard key={product.id} product={product} />
                    ))}
                </div>

                {/* "Pagination" -> Load More */}
                {paginatedProducts.length < sortedProducts.length && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={() => updateFilter({ page: filterState.page + 1 })}
                            className="group relative px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
