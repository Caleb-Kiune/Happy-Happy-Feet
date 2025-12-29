"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";

type SortOption = {
    label: string;
    value: string;
};

const SORT_OPTIONS: SortOption[] = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-asc" },
];

interface SortSheetProps {
    currentSort: string;
    onSortChange: (value: string) => void;
}

export default function SortSheet({ currentSort, onSortChange }: SortSheetProps) {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive check for side positioning
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const activeLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Featured";

    const handleSelect = (value: string) => {
        onSortChange(value);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-900 transition-all hover:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                    <span className="truncate mr-2">Sort by: <span className="font-medium text-gray-900">{activeLabel}</span></span>
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </button>
            </SheetTrigger>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={`
                    bg-white text-gray-900 shadow-xl p-0 flex flex-col
                    ${isMobile ? "h-auto rounded-t-2xl border-t border-gray-200" : "w-[340px] border-l border-gray-200 sm:rounded-none"}
                `}
            >
                <SheetHeader className="px-8 pt-8 pb-6 border-b border-gray-100 text-left">
                    <SheetTitle className="text-xl font-bold tracking-tight text-gray-900">Sort Products</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-y-3">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`flex items-center justify-between px-6 py-5 text-left text-base font-medium transition-all rounded-xl ${currentSort === option.value
                                    ? "bg-accent-500 text-white shadow-md shadow-accent-500/20"
                                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-transparent"
                                }`}
                        >
                            {option.label}
                            {currentSort === option.value && (
                                <Check className="h-5 w-5 text-white" />
                            )}
                        </button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
