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
import { deleteProduct, deleteProducts } from "@/app/admin/products/actions";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductRow from "@/components/admin/ProductRow";
import { Product } from "@/lib/products";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { toast } from "sonner";
import { useTransition } from "react";

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
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, startTransition] = useTransition();

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

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} products? This will also delete their images and cannot be undone.`)) {
            return;
        }

        startTransition(async () => {
            const result = await deleteProducts(Array.from(selectedIds));
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`${selectedIds.size} products deleted successfully`);
                setSelectedIds(new Set());
            }
        });
    };

    const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all";
    const isAllSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

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

                {/* Bulk Action Bar (Overlay or next to count) */}
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-4 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-sm font-medium text-red-700">
                            {selectedIds.size} selected
                        </span>
                        <div className="h-4 w-px bg-red-200" />
                        <Button
                            variant="link"
                            size="sm"
                            className="text-red-600 h-auto p-0 hover:text-red-800"
                            onClick={() => setSelectedIds(new Set())}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Selected"}
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium text-[#111111]">{filteredProducts.length}</span> of {initialProducts.length} products
                    </div>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#FAFAFA]">
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#111111] focus:ring-[#111111]"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
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
                            <ProductRow
                                key={product.id}
                                product={product}
                                isSelected={selectedIds.has(product.id)}
                                onToggleSelect={toggleSelect}
                            />
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
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
                {selectedIds.size > 0 && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between sticky top-0 z-10">
                        <span className="text-sm font-medium text-red-700">
                            {selectedIds.size} selected
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-100"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}

                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className={`bg-white border text-left p-4 flex gap-4 shadow-sm rounded-xl transition-colors ${selectedIds.has(product.id) ? "border-red-200 bg-red-50/50" : "border-[#E5E5E5]"}`}
                        onClick={() => toggleSelect(product.id)}
                    >
                        {/* Checkbox for mobile tap selection */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-[#111111] focus:ring-[#111111] h-5 w-5"
                                checked={selectedIds.has(product.id)}
                                onChange={() => toggleSelect(product.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            {product.images[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    placeholder="blur"
                                    blurDataURL={PLACEHOLDER_IMAGE}
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
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
