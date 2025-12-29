"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Container from "@/components/Container";
import ShoeCard from "@/components/ShoeCard";
import { products, Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Search, X, Check, ChevronDown } from "lucide-react";
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

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Derive unique categories from products
const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
const CATEGORIES = ["All", ...uniqueCategories.map(capitalize)];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize state from URL params or defaults
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");

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

        // Update URL
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [activeCategory, debouncedQuery, sortBy, pathname, router, searchParams]);

    // Filter products
    const filteredProducts = products.filter((product) => {
        // 1. Category Filter
        const matchesCategory =
            activeCategory === "All" ||
            product.category.toLowerCase() === activeCategory.toLowerCase();

        // 2. Search Filter (Name or Description)
        const q = debouncedQuery.toLowerCase();
        const matchesSearch =
            product.name.toLowerCase().includes(q) ||
            (product.description && product.description.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
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
                                    Sort by: <span className="text-gray-900">{SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Featured"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl rounded-xl border-gray-100 p-2">
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Filters */}
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
                    {sortedProducts.map((product) => (
                        <ShoeCard key={product.id} product={product} />
                    ))}
                </div>

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

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-white" />}>
            <ShopContent />
        </Suspense>
    );
}
