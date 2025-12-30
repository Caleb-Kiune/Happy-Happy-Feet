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
import { Loader2, Plus, X, UploadCloud } from "lucide-react";

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

const CATEGORIES = ["heels", "sandals", "sneakers", "flats", "boots"];
const AVAILABLE_SIZES = ["36", "37", "38", "39", "40", "41", "42"];

export default function ProductForm({ initialData, action }: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [category, setCategory] = useState(initialData?.category || "heels");
    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [imageUrlInput, setImageUrlInput] = useState("");

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

    // Image Management
    const addImage = () => {
        if (!imageUrlInput) return;
        setImages(prev => [...prev, imageUrlInput]);
        setImageUrlInput("");
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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
                                    {CATEGORIES.map(c => (
                                        <SelectItem key={c} value={c} className="capitalize">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Available Sizes</Label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`
                                        h-10 w-10 rounded-full border text-sm font-medium transition-colors
                                        ${sizes.includes(size)
                                            ? "bg-[#111111] text-white border-[#111111]"
                                            : "bg-white text-[#666666] border-[#E5E5E5] hover:border-[#111111]"}
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
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

                    {/* Image List */}
                    <div className="grid grid-cols-2 gap-4 min-h-[100px] content-start">
                        {images.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                <Image
                                    src={url}
                                    alt={`Product ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-[#111111]/80 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Main
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Placeholder if empty */}
                        {images.length === 0 && (
                            <div className="col-span-2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                                <UploadCloud className="w-8 h-8 mb-2" />
                                <span className="text-sm">No images added yet</span>
                            </div>
                        )}
                    </div>

                    {/* Add Image Input */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide">Add Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                placeholder="https://..."
                                className="flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addImage();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addImage} variant="outline" size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400">
                            Paste a direct link to an image (e.g. from Supabase Storage or Unsplash).
                        </p>
                    </div>
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
