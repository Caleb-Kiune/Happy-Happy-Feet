"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Search, X, Filter, Trash2, ArrowUpDown } from "lucide-react";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import { deleteProducts } from "@/app/admin/products/actions";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductRow from "@/components/admin/ProductRow";
import { Product } from "@/lib/products";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
        const allCategories = initialProducts.flatMap((p) => p.categories || []);
        const uniqueCategories = new Set(allCategories);
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
                selectedCategory === "all" || (product.categories && product.categories.includes(selectedCategory));

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

    // Filter Component (Reusable for Desktop & Mobile Sheet)
    const FilterControls = ({ mobile = false }) => (
        <div className={cn("flex flex-col gap-4", mobile ? "w-full" : "flex-row w-full md:w-auto")}>
            {/* Search Input */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name..."
                    className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Category Dropdown */}
            <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
            >
                <SelectTrigger className="w-full md:w-48 bg-gray-50 border-transparent focus:bg-white rounded-full">
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
                    className="text-gray-500 hover:text-red-500 self-start md:self-auto rounded-full px-4"
                >
                    Clear
                </Button>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Desktop Filters (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <FilterControls />
                </div>

                {/* Mobile Filter Trigger + Result Count */}
                <div className="flex md:hidden items-center justify-between w-full">
                    <div className="text-sm font-medium text-gray-500">
                        {filteredProducts.length} Results
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full border-gray-200 bg-white shadow-sm">
                                <Filter className="w-4 h-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 rounded-full bg-[#E07A8A]" />
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-3xl">
                            <SheetHeader className="mb-6 text-left">
                                <SheetTitle>Filter Products</SheetTitle>
                                <SheetDescription>
                                    Narrow down your search by name or category.
                                </SheetDescription>
                            </SheetHeader>
                            <FilterControls mobile />
                            <SheetFooter className="mt-8">
                                <SheetClose asChild>
                                    <Button className="w-full bg-[#111111] text-white rounded-full h-12">
                                        Show {filteredProducts.length} Products
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden md:block text-sm text-gray-400 font-medium">
                    {filteredProducts.length} Products Found
                </div>
            </div>

            {/* Bulk Action Floating Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-4 right-4 md:left-[calc(18rem+2rem)] md:right-8 flex justify-center z-40 mb-[env(safe-area-inset-bottom)] pointer-events-none animate-in slide-in-from-bottom-5 fade-in">
                    <div className="bg-[#111111] text-white rounded-full shadow-xl px-6 py-3 flex items-center gap-6 pointer-events-auto">
                        <span className="text-sm font-medium pl-2">
                            {selectedIds.size} selected
                        </span>
                        <div className="h-4 w-px bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:text-white h-8 hover:bg-white/10 rounded-full px-3"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#E07A8A] hover:bg-[#D16A7A] text-white h-8 rounded-full px-4 shadow-sm"
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Table - Premium, Clean Style */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                            <TableHead className="w-[50px] pl-6">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#111111] focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-gray-400">Image</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Name</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Price</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</TableHead>
                            <TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product, index) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                isSelected={selectedIds.has(product.id)}
                                onToggleSelect={toggleSelect}
                            />
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="bg-gray-50 p-4 rounded-full">
                                            <Search className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="font-medium text-gray-900">No products found</p>
                                        <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                                        <Button variant="link" onClick={clearFilters} className="text-[#E07A8A]">
                                            Clear all filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card Layout - Refined */}
            <div className="grid grid-cols-1 gap-4 md:hidden pb-24">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => toggleSelect(product.id)}
                        className={cn(
                            "group relative overflow-hidden bg-white rounded-2xl transition-all duration-200",
                            selectedIds.has(product.id)
                                ? "ring-2 ring-[#E07A8A] shadow-md bg-pink-50/10"
                                : "shadow-sm border border-gray-100"
                        )}
                    >
                        <div className="flex p-3 gap-4">
                            {/* Image - Larger & Cleaner */}
                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                                {product.images[0] && (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                )}
                                {/* Checkbox Overlay */}
                                <div className="absolute top-2 left-2">
                                    <input
                                        type="checkbox"
                                        className={cn(
                                            "rounded-full border-white/50 bg-white/80 text-[#E07A8A] focus:ring-0 h-5 w-5 transition-all",
                                            selectedIds.has(product.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}
                                        checked={selectedIds.has(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-bold text-[#111111] line-clamp-1">
                                            {product.name}
                                        </h3>
                                        {product.featured && (
                                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#E07A8A]" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">
                                        {product.categories ? product.categories.join(", ") : "Uncategorized"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-[#111111]">
                                        KSh {product.price.toLocaleString()}
                                    </span>

                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-gray-50 text-gray-600">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium">No results found</h3>
                        <Button variant="link" onClick={clearFilters} className="text-[#E07A8A]">
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
