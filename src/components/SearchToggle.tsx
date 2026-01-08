"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopSearch } from "@/context/ShopSearchContext";

interface SearchToggleProps {
    mobile?: boolean;
    variant?: "dark" | "light"; // New prop
}

export default function SearchToggle({ mobile = false, variant = "dark" }: SearchToggleProps) {
    const router = useRouter();
    const { searchQuery, setSearchQuery, isShopPage, isLiveSearchEnabled } = useShopSearch();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Sync state from global context (e.g. if cleared from Grid, or Navigated with URL)
    useEffect(() => {
        if (isShopPage) {
            setQuery(searchQuery);
        }
    }, [searchQuery, isShopPage]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // If query is empty, close. If not empty, maybe keep open?
                // Standard behavior is close.
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Auto-focus when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (isShopPage && isLiveSearchEnabled) {
            setIsSearching(true);
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

            // Guard: Short query check (optional per request, skip < 2 chars unless clearing)
            if (val.length > 0 && val.length < 2) {
                setIsSearching(false);
                return;
            }

            debounceTimeoutRef.current = setTimeout(() => {
                setSearchQuery(val);
                setIsSearching(false);
            }, 300);
        }
    };

    const handleClear = () => {
        setQuery("");
        if (isShopPage && isLiveSearchEnabled) {
            setSearchQuery("");
        }
        if (inputRef.current) inputRef.current.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isShopPage && isLiveSearchEnabled) {
            // Force update immediate
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
            setSearchQuery(query);
            setIsSearching(false);
            return;
        }

        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
            // Don't close immediately on mobile? Usually better to close to see results.
            setIsOpen(false);
            // Don't clear query, let it persist until nav complete or new search state takes over
        }
    };

    // Mobile implementation (Always Dark for contrast on white background)
    if (mobile) {
        return (
            <div ref={containerRef} className="">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-current hover:opacity-70 transition-opacity p-1"
                    aria-label="Search"
                    aria-expanded={isOpen}
                >
                    <Search className="h-6 w-6" strokeWidth={1.5} />
                </button>

                {/* Mobile Slide-Down Input */}
                <div
                    className={cn(
                        "absolute top-full left-0 w-full bg-white border-b border-gray-100 overflow-hidden transition-all duration-300 ease-in-out z-40 px-6",
                        isOpen ? "max-h-24 py-6 opacity-100 shadow-sm" : "max-h-0 py-0 opacity-0 border-none"
                    )}
                >
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder="SEARCH PRODUCTS..."
                            autoComplete="off"
                            className="w-full bg-transparent border-b border-gray-200 py-2 pr-10 text-base font-light text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors uppercase tracking-wider"
                        />
                        {isSearching ? (
                            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        ) : null}
                        {query ? (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 p-2 hover:text-gray-900"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 p-2 hover:text-gray-900"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </form>
                </div>
            </div>
        );
    }

    // Desktop implementation (Themed)
    const isLight = variant === "light";

    return (
        <div ref={containerRef} className="relative flex items-center">
            <div
                className={cn(
                    "flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isOpen ? "w-64 opacity-100 mr-4" : "w-0 opacity-0 mr-0"
                )}
            >
                <form onSubmit={handleSubmit} className="w-full relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        autoComplete="off"
                        className={cn(
                            "w-full bg-transparent border-b py-1 pr-8 text-sm focus:outline-none transition-colors tracking-wide",
                            isLight
                                ? "border-white/50 text-white placeholder-white/70 focus:border-white"
                                : "border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900"
                        )}
                    />

                    {isSearching ? (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <Loader2 className={cn("h-3 w-3 animate-spin", isLight ? "text-white/70" : "text-gray-400")} />
                        </div>
                    ) : null}

                    {query ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={cn(
                                "absolute right-0 top-1/2 -translate-y-1/2",
                                isLight ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-900"
                            )}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "absolute right-0 top-1/2 -translate-y-1/2",
                                isLight ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-900"
                            )}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "text-current hover:opacity-70 transition-opacity p-1",
                    isOpen && "opacity-100" // Keep visible
                )}
                aria-label="Toggle search"
            >
                <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
        </div>
    );
}
