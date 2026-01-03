"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { Pencil, Loader2, Check, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/lib/constants";
import { quickUpdateProduct } from "@/app/admin/products/actions";
import { toast } from "sonner";

interface ProductRowProps {
    product: Product;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
}

export default function ProductRow({ product, isSelected, onToggleSelect }: ProductRowProps) {
    const [isPending, startTransition] = useTransition();

    // -- Inline Edit States --
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(product.name);

    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [priceDraft, setPriceDraft] = useState(product.price.toString());

    // -- Handlers --

    // Generic Quick Update Wrapper
    const handleQuickUpdate = async (updates: Partial<Product>) => {
        startTransition(async () => {
            const result = await quickUpdateProduct(product.id, updates);
            if (result?.error) {
                console.error(result.error);
                toast.error("Failed to update");
            } else {
                toast.success("Updated");
            }
        });
    };

    // Toggle Featured
    const toggleFeatured = () => {
        handleQuickUpdate({ featured: !product.featured });
    };

    // Name Edit
    const saveName = () => {
        setIsEditingName(false);
        if (nameDraft.trim() !== product.name) {
            handleQuickUpdate({ name: nameDraft });
        }
    };

    // Price Edit
    const savePrice = () => {
        setIsEditingPrice(false);
        const newPrice = parseFloat(priceDraft);
        if (!isNaN(newPrice) && newPrice !== product.price) {
            handleQuickUpdate({ price: newPrice });
        } else {
            setPriceDraft(product.price.toString()); // Reset if invalid or unchanged
        }
    };



    // Size Toggle
    const toggleSize = (size: string) => {
        const currentSizes = new Set(product.sizes);
        if (currentSizes.has(size)) {
            currentSizes.delete(size);
        } else {
            currentSizes.add(size);
        }
        const newSizes = Array.from(currentSizes).sort();
        handleQuickUpdate({ sizes: newSizes });
    };


    return (
        <TableRow className={isSelected ? "bg-gray-50" : ""}>
            {/* Checkbox */}
            <TableCell>
                <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#111111] focus:ring-[#111111]"
                    checked={isSelected}
                    onChange={() => onToggleSelect(product.id)}
                />
            </TableCell>

            {/* Image */}
            <TableCell>
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            placeholder="blur"
                            blurDataURL={PLACEHOLDER_IMAGE}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                            No Img
                        </div>
                    )}
                </div>
            </TableCell>

            {/* Name (Editable) */}
            <TableCell className="font-medium text-[#111111]">
                {isEditingName ? (
                    <Input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        onBlur={saveName}
                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                        autoFocus
                        className="h-8 w-full min-w-[150px]"
                    />
                ) : (
                    <span
                        onClick={() => setIsEditingName(true)}
                        className="cursor-pointer hover:underline decoration-dashed decoration-gray-300 underline-offset-4"
                        title="Click to edit name"
                    >
                        {product.name}
                    </span>
                )}
            </TableCell>

            {/* Category (Popover Multi-select) */}
            <TableCell className="capitalize text-gray-600">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            disabled={isPending}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors hover:bg-gray-200 text-left max-w-[150px] truncate
                                ${product.categories && product.categories.length > 0 ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-500"}
                            `}
                        >
                            {product.categories && product.categories.length > 0
                                ? product.categories.join(", ")
                                : "Select..."}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3 bg-[#0F172A] border-slate-700" align="start">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-white">Manage Categories</h4>
                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                                {PRODUCT_CATEGORIES.map((c) => {
                                    const isActive = product.categories?.includes(c) || false;
                                    return (
                                        <div key={c} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`row-cat-${product.id}-${c}`}
                                                className="rounded border-slate-500 bg-slate-800 text-blue-500 focus:ring-blue-500 h-4 w-4"
                                                checked={isActive}
                                                onChange={() => {
                                                    const current = product.categories || [];
                                                    let newCategories;
                                                    if (current.includes(c)) {
                                                        newCategories = current.filter(cat => cat !== c);
                                                    } else {
                                                        newCategories = [...current, c];
                                                    }
                                                    handleQuickUpdate({ categories: newCategories });
                                                }}
                                            />
                                            <label
                                                htmlFor={`row-cat-${product.id}-${c}`}
                                                className="text-sm text-gray-200 font-medium cursor-pointer capitalize flex-1 hover:text-white select-none"
                                            >
                                                {c}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </TableCell>

            {/* Price (Editable) */}
            <TableCell>
                {isEditingPrice ? (
                    <div className="flex items-center">
                        <span className="text-gray-400 text-sm mr-1">KSh</span>
                        <Input
                            type="number"
                            value={priceDraft}
                            onChange={(e) => setPriceDraft(e.target.value)}
                            onBlur={savePrice}
                            onKeyDown={(e) => e.key === "Enter" && savePrice()}
                            autoFocus
                            className="h-8 w-24"
                        />
                    </div>
                ) : (
                    <span
                        onClick={() => setIsEditingPrice(true)}
                        className="cursor-pointer hover:underline decoration-dashed decoration-gray-300 underline-offset-4"
                        title="Click to edit price"
                    >
                        KSh {product.price.toLocaleString()}
                    </span>
                )}
            </TableCell>

            {/* Sizes (Popover) */}
            <TableCell>
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            disabled={isPending}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors
                                ${product.sizes.length > 0 ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-red-50 text-red-600 hover:bg-red-100"}
                            `}
                        >
                            {product.sizes.length} sizes
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-900">Manage Sizes</h4>
                            <div className="flex flex-wrap gap-2">
                                {PRODUCT_SIZES.map((size) => {
                                    const isActive = product.sizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`
                                                h-8 w-8 rounded-full border text-xs font-medium transition-all
                                                ${isActive
                                                    ? "bg-green-600 text-white border-green-600"
                                                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-gray-500">Green = In Stock</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </TableCell>

            {/* Status / Featured */}
            <TableCell>
                <button
                    onClick={toggleFeatured}
                    disabled={isPending}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${product.featured
                        ? "bg-[#FDF2F4] text-[#D16A7A] hover:bg-[#FCEEF1]"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                >
                    {isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                        product.featured && <Star className="w-3 h-3 mr-1 fill-current" />
                    )}
                    {product.featured ? "Featured" : "Standard"}
                </button>
            </TableCell>

            {/* Actions */}
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
    );
}
