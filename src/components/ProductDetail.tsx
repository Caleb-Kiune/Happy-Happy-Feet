"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, Check, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

type ProductDetailProps = {
    product: Product;
};

const PHONE_NUMBER = "254705774171";

export default function ProductDetail({ product }: ProductDetailProps) {
    const { dispatch } = useCart();
    const [activeImage, setActiveImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Fallback if product has no sizes defined
    const sizes = product.sizes || [];

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!selectedSize && sizes.length > 0) {
            toast.error("Size required", {
                description: "Please select a size before adding to cart.",
            });
            return;
        }

        const sizeToUse = selectedSize || "One Size";

        dispatch({
            type: "ADD_ITEM",
            payload: {
                id: `${product.id}-${sizeToUse}`,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                size: sizeToUse,
                quantity: quantity
            }
        });

        toast.success("Added to cart! 🛍️", {
            description: "Your shoes are waiting in the cart.",
        });
        setQuantity(1);
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!selectedSize && sizes.length > 0) {
            e.preventDefault();
            toast.error("Size required", {
                description: "Please select a size before ordering.",
            });
            return;
        }
    };

    const message = selectedSize
        ? `Hi! I'd like to order the ${product.name} in size ${selectedSize}. Thank you!`
        : `Hi! I'm interested in the ${product.name}. Please send size options.`;

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="flex flex-col gap-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                    <Image
                        src={activeImage}
                        alt={product.name}
                        fill
                        priority
                        className="h-full w-full object-cover object-center"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                    <div className="flex gap-x-4 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${activeImage === img
                                    ? "border-accent-500 opacity-100"
                                    : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <h1 className="font-sans text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                    {product.name}
                </h1>
                <div className="mt-4 flex items-end">
                    <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <div className="mt-6 border-t border-b border-gray-100 py-6">
                    <p className="text-base text-gray-500 leading-relaxed">
                        {product.description || "No description available."}
                    </p>
                </div>

                {/* Size Selector */}
                {sizes.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-md border text-sm font-medium transition-all ${selectedSize === size
                                        ? "border-accent-500 bg-accent-500 text-white"
                                        : "border-gray-200 bg-white text-gray-900 hover:border-accent-500 hover:text-accent-500"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <p className="mt-2 text-sm text-success flex items-center gap-1">
                                <Check className="h-3 w-3" /> Size {selectedSize} selected
                            </p>
                        )}
                    </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                    <div className="mt-3 flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="h-10 w-10"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-lg font-medium min-w-[20px] text-center">
                            {quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(1)}
                            className="h-10 w-10"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col gap-4">
                    {/* Add to Cart */}
                    <Button
                        onClick={handleAddToCart}
                        className="w-full rounded-full py-6 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all"
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>

                    {/* WhatsApp */}
                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full py-6 text-lg font-semibold border-success text-success hover:bg-success/5 hover:text-success transition-all"
                    >
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWhatsAppClick}
                            className="flex items-center justify-center gap-x-2"
                        >
                            <Phone className="h-5 w-5" />
                            {selectedSize ? "Order on WhatsApp" : "Select Size to Order"}
                        </a>
                    </Button>

                    <p className="mt-2 text-center text-xs text-gray-400">
                        Secure checkout via WhatsApp. We'll confirm availability instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}
