"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchToggleProps {
    mobile?: boolean;
}

export default function SearchToggle({ mobile = false }: SearchToggleProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-focus when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
            setQuery(""); // Optional: clear after search to reset state
        }
    };

    // Mobile implementation (Slide-down from header)
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
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH PRODUCTS..."
                            className="w-full bg-transparent border-b border-gray-200 py-2 pr-10 text-base font-light text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors uppercase tracking-wider"
                        />
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 p-2 hover:text-gray-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Desktop implementation (Inline Expand)
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
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-transparent border-b border-gray-200 py-1 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors tracking-wide"
                    />
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); setQuery(""); }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                    >
                        <X className="h-3 w-3" />
                    </button>
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
