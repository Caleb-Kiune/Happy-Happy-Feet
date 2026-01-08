"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/app/admin/categories/actions";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type ShopCategoryBarProps = {
    categories: Category[];
    activeCategory: string;
    onSelectCategory: (slug: string) => void;
};

export default function ShopCategoryBar({
    categories,
    activeCategory,
    onSelectCategory,
}: ShopCategoryBarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Check scroll capability
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [categories]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === "left"
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="w-full bg-white border-b border-gray-100 sticky top-20 sm:top-24 md:top-32 z-40 transition-all duration-300">
            <div className="max-w-[1920px] mx-auto relative group">
                {/* Desktop Left Gradient/Arrow */}
                <div
                    className={cn(
                        "absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 flex items-center justify-start pl-2 transition-opacity duration-300 pointer-events-none md:pointer-events-auto",
                        canScrollLeft ? "opacity-100" : "opacity-0"
                    )}
                >
                    <button
                        onClick={() => scroll("left")}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors pointer-events-auto hidden md:block"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto no-scrollbar scroll-smooth py-4 px-4 md:px-12 gap-3 md:gap-4 items-center snap-x"
                    role="tablist"
                    aria-label="Product Categories"
                >
                    <button
                        onClick={() => onSelectCategory("All")}
                        role="tab"
                        aria-selected={activeCategory === "All"}
                        aria-controls="product-grid"
                        className={cn(
                            "relative shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border snap-start outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                            activeCategory === "All"
                                ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                        )}
                    >
                        View All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.name)}
                            role="tab"
                            aria-selected={activeCategory === category.name}
                            className={cn(
                                "relative shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border snap-start outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                                activeCategory === category.name
                                    ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}

                    {/* Padding spacer to ensure last item is not flush with edge */}
                    <div className="w-4 md:w-16 shrink-0" />
                </div>

                {/* Desktop Right Gradient/Arrow */}
                <div
                    className={cn(
                        "absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end pr-2 transition-opacity duration-300 pointer-events-none md:pointer-events-auto",
                        canScrollRight ? "opacity-100" : "opacity-0"
                    )}
                >
                    <button
                        onClick={() => scroll("right")}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors pointer-events-auto hidden md:block"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
