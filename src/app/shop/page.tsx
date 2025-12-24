"use client";

import { useState } from "react";
import Container from "@/components/Container";
import ShoeCard from "@/components/ShoeCard";
import { products, Product } from "@/lib/products";
import { Button } from "@/components/ui/button";

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Derive unique categories from products
const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
const CATEGORIES = ["All", ...uniqueCategories.map(capitalize)];

// Skipping metadata export in client component
export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts =
        activeCategory === "All"
            ? products
            : products.filter(
                (product) =>
                    product.category.toLowerCase() === activeCategory.toLowerCase()
            );

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

                {/* Filters */}
                <div className="mt-12 flex flex-wrap justify-center gap-2">
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
                    {filteredProducts.map((product) => (
                        <ShoeCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="mt-20 text-center">
                        <p className="text-gray-500">No products found in this category.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
