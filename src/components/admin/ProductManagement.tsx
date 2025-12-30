"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { Product } from "@/lib/products";

// Debounce hook implementation inline for simplicity
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

interface ProductManagementProps {
    initialProducts: Product[];
}

export default function ProductManagement({ initialProducts }: ProductManagementProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Debounce search query logic (300ms)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Derive categories dynamically from products
    const categories = useMemo(() => {
        const uniqueCategories = new Set(initialProducts.map((p) => p.category));
        return Array.from(uniqueCategories).sort();
    }, [initialProducts]);

    // Filter logic
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            // 1. Text Search (Name or Description)
            const query = debouncedSearchQuery.toLowerCase();
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query));

            // 2. Category Filter
            const matchesCategory =
                selectedCategory === "all" || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, debouncedSearchQuery, selectedCategory]);

    // Clear filters handler
    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
    };

    const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all";

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Dropdown */}
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full md:w-48 bg-white">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category} className="capitalize">
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-gray-500 hover:text-[#111111]"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Count Display (Hidden on tiny screens if needed, but good to have) */}
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-[#111111]">{filteredProducts.length}</span> of {initialProducts.length} products
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#FAFAFA]">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Sizes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        {product.images[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-[#111111]">
                                    {product.name}
                                </TableCell>
                                <TableCell className="capitalize text-gray-600">
                                    {product.category}
                                </TableCell>
                                <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        {product.sizes.length} sizes
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {product.featured && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FDF2F4] text-[#D16A7A]">
                                            Featured
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-[#111111]"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="h-8 w-8 text-gray-300" />
                                        <p>No products found matching your filters.</p>
                                        <Button variant="link" onClick={clearFilters} className="text-[#E07A8A]">
                                            Clear filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex gap-4 shadow-sm"
                    >
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            {product.images[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-[#111111] truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {product.category}
                                    </p>
                                </div>
                                {product.featured && (
                                    <span className="flex-shrink-0 inline-block h-2 w-2 rounded-full bg-[#E07A8A]" />
                                )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-semibold text-[#111111]">
                                    KSh {product.price.toLocaleString()}
                                </span>
                                <div className="flex gap-1">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No products found.</p>
                        <Button variant="link" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
