"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, Check, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { PRODUCT_SIZES, CONTACT_INFO } from "@/lib/constants";

type ProductDetailProps = {
    product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
    const { dispatch } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fallback if product has no sizes defined
    const sizes = product.sizes || [];

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!selectedSize && sizes.length > 0) {
            toast.error("Size selection required", {
                description: "Please choose your size to continue.",
            });
            return;
        }

        const sizeToUse = selectedSize || "One Size";

        dispatch({
            type: "ADD_ITEM",
            payload: {
                id: `${product.id}-${sizeToUse}`,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                size: sizeToUse,
                quantity: quantity
            }
        });

        toast.success("Added to cart", {
            description: "View your bag to checkout.",
        });
        setQuantity(1); // Reset quantity
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!selectedSize && sizes.length > 0) {
            e.preventDefault();
            toast.error("Size selection required", {
                description: "Please choose your size first.",
            });
            return;
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setCurrentImageIndex(index);
        }
    };

    const message = selectedSize
        ? `Hi! I'd like to order the ${product.name} in size ${selectedSize} (Qty: ${quantity}). Thank you!`
        : `Hi! I'm interested in the ${product.name}. Please send size options.`;

    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 lg:gap-x-16">
            {/* Left Column: Image Gallery (Editorial Scroll) */}
            <div className="lg:col-span-7 flex flex-col gap-4">

                {/* Mobile: Swipeable Carousel */}
                <div className="relative lg:hidden group -mx-4 sm:mx-0">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[4/5] w-full bg-gray-50"
                    >
                        {product.images.map((img, idx) => (
                            <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    fill
                                    priority={idx === 0}
                                    placeholder="blur"
                                    blurDataURL={PLACEHOLDER_IMAGE}
                                    className="object-cover object-center"
                                    sizes="(min-width: 1024px) 60vw, 100vw"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Dots */}
                    {product.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {product.images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all shadow-sm ${currentImageIndex === idx
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop: Vertical Stack */}
                <div className="hidden lg:flex flex-col gap-6">
                    {product.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/5] w-full bg-gray-50">
                            <Image
                                src={img}
                                alt={`${product.name} view ${idx + 1}`}
                                fill
                                priority={idx === 0}
                                placeholder="blur"
                                blurDataURL={PLACEHOLDER_IMAGE}
                                className="object-cover object-center"
                                sizes="60vw"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Product Info (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit flex flex-col pt-2 lg:pt-0">
                <div className="mb-2">
                    <h1 className="font-sans text-3xl md:text-4xl font-bold tracking-[0.2em] text-gray-900 uppercase">
                        {product.name}
                    </h1>
                </div>

                <div className="mt-2 mb-6">
                    <p className="text-2xl font-light text-gray-900">
                        {formatPrice(product.price)}
                    </p>
                </div>

                {/* Description - Clean & Open */}
                <div className="mb-8 text-gray-600 leading-relaxed font-light text-sm">
                    {product.description || "Timeless design meets exceptional comfort. Handcrafted for the modern wardrobe."}
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Select Size</span>
                        {selectedSize && (
                            <span className="text-xs text-gray-500">Selected: {selectedSize}</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {PRODUCT_SIZES.map((size) => {
                            const isAvailable = sizes.includes(size);
                            const isSelected = selectedSize === size;

                            return (
                                <button
                                    key={size}
                                    onClick={() => isAvailable && setSelectedSize(size)}
                                    disabled={!isAvailable}
                                    className={`
                                        h-11 w-11 flex items-center justify-center text-sm transition-all border
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : isAvailable
                                                ? "border-gray-200 bg-transparent text-gray-900 hover:border-gray-900"
                                                : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                                        }
                                    `}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quantity Control (Subtle, Reintroduced) */}
                <div className="mb-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 block mb-3">Quantity</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-sm">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-auto">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] bg-gray-900 hover:bg-gray-800 text-white shadow-none transition-all"
                    >
                        Add to Bag
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-none h-12 text-xs font-bold uppercase tracking-[0.2em] text-gray-900 border-gray-200 hover:border-gray-900 hover:bg-transparent transition-all"
                    >
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWhatsAppClick}
                            className="flex items-center justify-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            Quick Order via WhatsApp
                        </a>
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <ul className="space-y-2 text-xs text-gray-500 font-light tracking-wide uppercase">
                        <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" /> Secure Checkout
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" /> Local Delivery available
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
