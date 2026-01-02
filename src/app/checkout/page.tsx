"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Phone, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { createOrder } from "./actions";

export default function CheckoutPage() {
    const { state, dispatch, totalPrice, totalItems } = useCart();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        notes: "",
    });

    useEffect(() => {
        setIsMounted(true);
        // Redirect if empty and not in success state
        if (state.items.length === 0 && !isSuccess) {
            // We allow a brief moment or we could redirect immediately.
            // Better to handle "Empty Cart" UI if user navigates directly.
        }
    }, [state.items.length, isSuccess]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [isPending, startTransition] = useTransition();

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.phone || !formData.location) {
            toast.error("Missing information", {
                description: "Please fill in all required fields marked with *",
            });
            return;
        }

        startTransition(async () => {
            // 1. Create Order in Database
            const result = await createOrder({
                customer: {
                    name: formData.name,
                    phone: formData.phone,
                    location: formData.location,
                    notes: formData.notes,
                },
                items: state.items.map(item => {
                    // Use explicit productId if available, otherwise fallback to parsing the composite ID (legacy support)
                    // Composite ID format: "${uuid}-${size}"
                    const validProductId = item.productId || item.id.split('-')[0];

                    return {
                        product_id: validProductId,
                        product_name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    };
                }),
                total: totalPrice,
            });

            if (result.error) {
                toast.error("Failed to save order", {
                    description: result.error,
                });
                return;
            }

            const orderId = result.orderId;

            // 2. Construct WhatsApp Message
            const itemsList = state.items
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.name} (Size: ${item.size}) x ${item.quantity} - ${formatPrice(
                            item.price * item.quantity
                        )}`
                )
                .join("\n");

            const subtotal = formatPrice(totalPrice);

            const message = `*New Order from Happy Happy Feet* 🛍️
--------------------------------
*Order ID:* #${orderId?.slice(0, 8)}
*Customer:* ${formData.name}
*Phone:* ${formData.phone}
*Location:* ${formData.location}
${formData.notes ? `*Note:* ${formData.notes}` : ""}

*Order Details:*
${itemsList}

*Subtotal:* ${subtotal}
--------------------------------
Please confirm availability and delivery fee. Thank you!`;

            const whatsappUrl = `https://wa.me/254705774171?text=${encodeURIComponent(
                message
            )}`;

            // 3. Open WhatsApp
            window.open(whatsappUrl, "_blank");

            // 4. Clear Cart and Show Success
            dispatch({ type: "CLEAR_CART" });
            setIsSuccess(true);
            toast.success("Order Saved!", {
                description: "Opening WhatsApp to complete your order...",
            });
        });
    };

    if (!isMounted) return null;

    // Success View
    if (isSuccess) {
        return (
            <div className="bg-white min-h-[60vh] flex items-center justify-center py-24">
                <Container>
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-20 w-20 text-success" />
                        </div>
                        <h1 className="font-sans text-3xl font-medium text-gray-900">
                            Order Sent!
                        </h1>
                        <p className="text-gray-500 text-lg">
                            We've received your order details via WhatsApp. We'll be in touch shortly to confirm availability and delivery.
                        </p>
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-gray-900 text-white rounded-full px-8 py-6 text-lg"
                        >
                            Back to Home
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    // Empty Cart View (if accessed directly)
    if (state.items.length === 0) {
        return (
            <div className="bg-white min-h-[60vh] flex items-center justify-center py-24">
                <Container>
                    <div className="text-center space-y-6">
                        <h1 className="font-sans text-2xl font-medium text-gray-900">
                            Your cart is empty
                        </h1>
                        <Button
                            onClick={() => router.push("/shop")}
                            variant="outline"
                            className="rounded-full px-8"
                        >
                            Start Shopping
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="bg-white py-16 md:py-24">
            <Container>
                <h1 className="font-sans text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl mb-12">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Customer Details Form */}
                    <div className="lg:col-span-7">
                        <h2 className="text-xl font-medium text-gray-900 mb-6">
                            Customer Details
                        </h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="+254..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="location"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Delivery Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g. Westlands, Nairobi"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="notes"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Special Instructions (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Any details about delivery or the order..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 bg-gray-50/50 border border-gray-100 rounded-lg p-6 space-y-6">
                            <h2 className="text-xl font-medium text-gray-900">
                                Order Summary
                            </h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                placeholder="blur"
                                                blurDataURL={PLACEHOLDER_IMAGE}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Size: {item.size} | Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-4">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>{formatPrice(totalPrice)}</p>
                                </div>
                                <div className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-md">
                                    Delivery fees will be confirmed via WhatsApp based on your location.
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isPending}
                                className="w-full rounded-full py-6 text-lg font-semibold bg-success hover:bg-success/90 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving Order...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="mr-2 h-5 w-5 fill-current" />
                                        Order via WhatsApp
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
