"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Phone, CheckCircle2, Loader2, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import { createOrder } from "./actions";
import { CONTACT_INFO } from "@/lib/constants";

export default function CheckoutPage() {
    const { state, dispatch, totalPrice } = useCart();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        notes: "",
    });

    // Validation State
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Basic check for required fields
        const isValid =
            formData.name.trim().length > 0 &&
            formData.phone.trim().length > 0 &&
            formData.location.trim().length > 0;
        setIsFormValid(isValid);
    }, [formData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [isPending, startTransition] = useTransition();

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Missing information", {
                description: "Please fill in all required fields.",
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

            const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
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
                            <CheckCircle2 className="h-20 w-20 text-gray-900" strokeWidth={1} />
                        </div>
                        <h1 className="font-sans text-3xl font-medium text-gray-900 uppercase tracking-widest">
                            Order Sent
                        </h1>
                        <p className="text-gray-500 font-light leading-relaxed">
                            Thank you. We've received your order details via WhatsApp. We'll be in touch shortly to confirm availability and delivery.
                        </p>
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-12 py-6 text-sm uppercase tracking-widest w-full sm:w-auto"
                        >
                            Back to Home
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    // Empty Cart View
    if (state.items.length === 0) {
        return (
            <div className="bg-white min-h-[60vh] flex items-center justify-center py-24">
                <Container>
                    <div className="text-center space-y-6">
                        <ShoppingBag className="h-12 w-12 mx-auto text-gray-300" strokeWidth={1} />
                        <h1 className="font-sans text-2xl font-medium text-gray-900 uppercase tracking-wide">
                            Your bag is empty
                        </h1>
                        <Button
                            onClick={() => router.push("/shop")}
                            variant="outline"
                            className="rounded-none px-10 py-6 text-sm uppercase tracking-widest border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                        >
                            Start Shopping
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="bg-white pb-24 pt-8 md:pt-16">
            <Container>
                {/* Mobile: Collapsible Order Summary */}
                <div className="lg:hidden mb-8 border-b border-gray-100 pb-4">
                    <button
                        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                        className="flex items-center justify-between w-full text-left py-2"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gray-900">
                            <span>{isSummaryOpen ? "Hide" : "Show"} Order Summary</span>
                            {isSummaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                    </button>

                    {isSummaryOpen && (
                        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-gray-50">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Size: {item.size} | Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left: Customer Details Form */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="mb-10">
                            <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-wide text-gray-900 uppercase mb-2">
                                Checkout
                            </h1>
                            <p className="text-gray-500 font-light">
                                Complete your order details below.
                            </p>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-10">
                            {/* Contact Info */}
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">
                                    Contact Information
                                </h2>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label htmlFor="name" className="sr-only">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Full Name *"
                                            className="block w-full border-b border-gray-200 py-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-light focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors bg-transparent rounded-none"
                                        />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="phone" className="sr-only">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number *"
                                            className="block w-full border-b border-gray-200 py-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-light focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors bg-transparent rounded-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">
                                    Delivery Details
                                </h2>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label htmlFor="location" className="sr-only">Delivery Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="Delivery Location / Landmark *"
                                            className="block w-full border-b border-gray-200 py-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-light focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors bg-transparent rounded-none"
                                        />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="notes" className="sr-only">Special Instructions</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Special Instructions (Optional)"
                                            rows={2}
                                            className="block w-full border-b border-gray-200 py-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-light focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors bg-transparent resize-none rounded-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4">
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isPending || !isFormValid}
                                    className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.15em] bg-gray-900 hover:bg-gray-800 text-white shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Phone className="mr-2 h-4 w-4 fill-current" />
                                            Complete Order via WhatsApp
                                        </>
                                    )}
                                </Button>
                                <p className="mt-4 text-center text-xs text-gray-400 font-light">
                                    By clicking "Complete Order", you'll be redirected to WhatsApp to send your details.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right: Order Summary (Desktop Sticky) */}
                    <div className="lg:col-span-5 order-1 lg:order-2 hidden lg:block">
                        <div className="sticky top-32">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">
                                Order Summary
                            </h2>

                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 mb-8">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-gray-50">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                placeholder="blur"
                                                blurDataURL={PLACEHOLDER_IMAGE}
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 py-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 font-light">
                                                Size: {item.size} | Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 pt-1">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-gray-500 uppercase tracking-wide">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-gray-400 font-light leading-relaxed">
                                    <div className="mt-0.5"><ShoppingBag className="h-3 w-3" /></div>
                                    <p>Delivery fees will be calculated and confirmed via WhatsApp based on your location.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
