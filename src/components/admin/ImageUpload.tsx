"use client";

import { useCallback, useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone"; // Note: We might need to install this or implement raw drag/drop if strict on dependencies. 
// User prompt said "shadcn/ui or custom", usually raw react-dropzone is best, but to stay lightweight I'll do custom logic first to avoid npm install if not needed, 
// BUT for robust drag/drop, react-dropzone is standard. I'll stick to a custom implementation to reduce dependency bloat unless requested.
// Wait - standard practice is to use a library for files. I will use a simple input type=file hidden trigger for now to be safe, 
// and wrap it in a custom drag/drop div. 

import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
    images: string[];
    onChange: (urls: string[]) => void;
    disabled?: boolean;
};

export default function ImageUpload({
    images,
    onChange,
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const onUpload = async (file: File) => {
        // 1. Validate
        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("File size too large (Max 5MB)");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file type. Please upload an image.");
            return;
        }

        setIsUploading(true);

        try {
            const supabase = createClient();

            // 2. Generate Unique Name: uuid + sanitized original name
            const fileExt = file.name.split(".").pop();
            const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9]/g, "-")}.${fileExt}`;
            const filePath = `${fileName}`;

            // 3. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("product-images")
                .getPublicUrl(filePath);

            // 5. Update State
            onChange([...images, publicUrl]);
            toast.success("Image uploaded");

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Sequential upload for multiple files
            files.forEach(file => onUpload(file));
        }
    }, [disabled, images]); // eslint-disable-line

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(file => onUpload(file));
        }
    };

    const removeImage = (urlToRemove: string) => {
        onChange(images.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div
                        key={url}
                        className="relative aspect-square rounded-lg border border-[#E5E5E5] bg-gray-50 overflow-hidden group"
                    >
                        <Image
                            src={url}
                            alt="Product Image"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button
                            type="button"
                            onClick={() => removeImage(url)}
                            disabled={disabled}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Upload Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center gap-2 cursor-pointer",
                    isDragging
                        ? "border-[#E07A8A] bg-[#FDF2F4]"
                        : "border-[#E5E5E5] hover:border-[#E07A8A] hover:bg-gray-50",
                    (disabled || isUploading) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={disabled || isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={handleFileSelect}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-[#666666]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#E07A8A]" />
                        <p className="text-sm font-medium">Uploading...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center border border-[#E5E5E5] mb-2">
                            <UploadCloud className="w-5 h-5 text-[#666666]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#111111]">
                                Click to upload <span className="text-[#999999] font-normal">or drag & drop</span>
                            </p>
                            <p className="text-xs text-[#999999] mt-1">
                                PNG, JPG, WEBP up to 5MB
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
