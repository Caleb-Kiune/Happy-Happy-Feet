"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import ShoeCard from "@/components/ShoeCard";
import { products, Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown } from "lucide-react";

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Derive unique categories from products
const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
const CATEGORIES = ["All", ...uniqueCategories.map(capitalize)];

// Skipping metadata export in client component
export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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
                    <div className="relative w-full md:w-48 flex-shrink-0">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="block w-full appearance-none rounded-full border-0 py-3 pl-5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-accent-500 sm:text-sm sm:leading-6 bg-white cursor-pointer"
                        >
                            <option value="featured">Sort: Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                        </select>
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
