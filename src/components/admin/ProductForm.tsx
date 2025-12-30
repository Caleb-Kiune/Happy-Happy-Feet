"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

import { PRODUCT_SIZES, PRODUCT_CATEGORIES } from "@/lib/constants";

// Types matching the form needs
type ProductFormProps = {
    initialData?: {
        id?: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        category: string;
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
    const [category, setCategory] = useState(initialData?.category || "heels");
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

        const formData = new FormData(e.currentTarget);
        // Append controlled fields that might not be in the form naturally or need formatting
        formData.set("category", category);
        formData.set("sizes", sizes.join(","));
        formData.set("imageUrls", images.join(","));
        // Checkbox "featured" is handled natively by the browser if named properly

        startTransition(async () => {
            const result = await action(null, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Product updated" : "Product created");
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8 bg-white p-6 md:p-8 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            required
                            placeholder="e.g. Classic Red Heels"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            placeholder="classic-red-heels"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (KSh)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                defaultValue={initialData?.price}
                                required
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory} name="category">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRODUCT_CATEGORIES.map(c => (
                                        <SelectItem key={c} value={c} className="capitalize">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Available Sizes (In Stock)</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRODUCT_SIZES.map(size => {
                                const isSelected = sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`
                                        h-10 w-10 rounded-full border text-sm font-medium transition-all
                                        ${isSelected
                                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}
                                    `}
                                        title={isSelected ? "In Stock" : "Out of Stock"}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Green = In Stock (Visible). Gray = Out of Stock (Disabled but visible).
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description}
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            name="featured"
                            defaultChecked={initialData?.featured}
                        />
                        <Label htmlFor="featured">Mark as Featured Product</Label>
                    </div>
                </div>

                {/* Right Column: Images */}
                <div className="space-y-6">
                    <Label>Product Images</Label>
                    <ImageUpload
                        images={images}
                        onChange={(newImages) => setImages(newImages)}
                        disabled={isPending}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#E07A8A] hover:bg-[#D66A7A] text-white rounded-full min-w-[140px]"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        initialData ? "Save Changes" : "Create Product"
                    )}
                </Button>
            </div>
        </form>
    );
}
