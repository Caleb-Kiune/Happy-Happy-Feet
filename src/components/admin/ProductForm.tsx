"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save, Info, Tag, Layers } from "lucide-react";
import ImageUpload from "./ImageUpload";

import { PRODUCT_SIZES, PRODUCT_CATEGORIES } from "@/lib/constants";

type ProductFormProps = {
    initialData?: {
        id?: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        categories: string[];
        sizes: string[];
        featured: boolean;
        images: string[];
    };
    action: (currentState: any, formData: FormData) => Promise<any>;
};

export default function ProductForm({ initialData, action }: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // Auto-generate slug
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (!initialData) {
            setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
        }
    };

    // Size Toggle
    const toggleSize = (size: string) => {
        setSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size].sort()
        );
    };

    // Submission Wrapper
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        if (categories.length === 0) {
            toast.error("Please select at least one category");
            return;
        }

        const formData = new FormData(e.currentTarget);
        // Append controlled fields
        formData.set("categories", categories.join(","));
        formData.set("sizes", sizes.join(","));
        formData.set("imageUrls", images.join(","));

        startTransition(async () => {
            const result = await action(null, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Product updated" : "Product created");
                if (!initialData) {
                    // If creating, maybe redirect or clear form? 
                    // For now user likely wants to stay or go back. Next.js router.push/back happens in calling code or manual nav.
                    // But here we rely on server action revalidating.
                    // Let's go back to list on success for generic flow
                    router.push("/admin/products");
                }
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-8 sticky top-6 z-20 bg-gray-50/80 backdrop-blur-md py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0">
                <div>
                    <h1 className="text-2xl font-bold font-sans text-gray-900">
                        {initialData ? "Edit Product" : "New Product"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {initialData ? `Updating ${initialData.name}` : "Add a new item to your catalog"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={isPending}
                        className="rounded-full text-gray-500 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#111111] hover:bg-black text-white rounded-full px-6 shadow-lg shadow-gray-200 transition-all active:scale-95"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Product
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">General Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-700">Product Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                    placeholder="e.g. Classic Red Heels"
                                    className="bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#E07A8A]/20 transition-all h-12 text-lg"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="text-gray-700">Slug (URL)</Label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 text-sm mr-2 select-none">/products/</span>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        required
                                        placeholder="classic-red-heels"
                                        className="bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#E07A8A]/20 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-gray-700">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={initialData?.description}
                                    className="bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#E07A8A]/20 transition-all min-h-[150px] leading-relaxed resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Media Gallery</h2>
                        </div>
                        <ImageUpload
                            images={images}
                            onChange={(newImages) => setImages(newImages)}
                            disabled={isPending}
                        />
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    {/* Organization Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Organization</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price" className="text-gray-600">Price (KSh)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">KSh</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        defaultValue={initialData?.price}
                                        required
                                        min="0"
                                        className="pl-12 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#E07A8A]/20 transition-all font-mono text-lg font-medium"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div className="space-y-3">
                                <Label className="text-gray-600">Categories</Label>
                                <div className="flex flex-wrap gap-2">
                                    {PRODUCT_CATEGORIES.map(c => {
                                        const isChecked = categories.includes(c);
                                        return (
                                            <div
                                                key={c}
                                                onClick={() => {
                                                    if (isChecked) {
                                                        setCategories(categories.filter(cat => cat !== c));
                                                    } else {
                                                        setCategories([...categories, c]);
                                                    }
                                                }}
                                                className={`
                                                    cursor-pointer select-none px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize
                                                    ${isChecked
                                                        ? "bg-[#FDF2F4] border-[#E07A8A] text-[#D16A7A]"
                                                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}
                                                `}
                                            >
                                                {c}
                                            </div>
                                        );
                                    })}
                                </div>
                                {categories.length === 0 && (
                                    <p className="text-[10px] text-red-500 font-medium animate-pulse">Required</p>
                                )}
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                <Checkbox
                                    id="featured"
                                    name="featured"
                                    defaultChecked={initialData?.featured}
                                    className="border-gray-400 data-[state=checked]:bg-[#E07A8A] data-[state=checked]:border-[#E07A8A]"
                                />
                                <Label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    Promote as Featured
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Sizes</h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {PRODUCT_SIZES.map(size => {
                                const isSelected = sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`
                                        h-10 w-10 rounded-xl border text-sm font-medium transition-all
                                        ${isSelected
                                                ? "bg-green-500 text-white border-green-500 shadow-sm shadow-green-200 scale-105"
                                                : "bg-gray-50 text-gray-400 border-transparent hover:bg-white hover:border-gray-200"}
                                    `}
                                        title={isSelected ? "In Stock" : "Out of Stock"}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight">
                            Tap to toggle availability. <br />
                            <span className="text-green-600 font-medium">Green</span> = In Stock.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
