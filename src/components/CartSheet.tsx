"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";

export default function CartSheet() {
    const { state, dispatch, totalItems, totalPrice } = useCart();
    const router = useRouter();

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id, quantity: newQuantity },
        });
    };

    const handleRemoveItem = (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
        toast("Item removed", {
            description: "The item has been removed from your cart.",
        });
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

    const handleStartShopping = () => {
        router.push("/shop");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent text-gray-900">
                    <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                    {totalItems > 0 && (
                        <span className="absolute top-0 -right-1 flex h-4 w-4 items-center justify-center text-[10px] font-medium text-gray-900">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-[540px] border-l border-gray-200 bg-white p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-gray-100 flex-shrink-0 flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-left font-sans text-lg font-bold uppercase tracking-widest text-gray-900">
                        Your Bag {totalItems > 0 && `(${totalItems})`}
                    </SheetTitle>
                    {/* Custom Close Button for cleaner look if needed, but SheetContent has default close. We rely on default close for accessibility but layout aligns. */}
                </SheetHeader>

                {state.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                        <ShoppingBag className="h-12 w-12 text-gray-300 stroke-1" />
                        <div className="space-y-4">
                            <h3 className="text-xl font-light text-gray-900 uppercase tracking-wide">
                                Your wardrobe is waiting
                            </h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[200px] mx-auto">
                                Discover our latest collection and find your perfect fit.
                            </p>
                        </div>
                        <SheetClose asChild>
                            <Button
                                onClick={handleStartShopping}
                                className="rounded-none px-10 py-6 text-xs uppercase tracking-[0.2em] font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all"
                            >
                                Start Shopping
                            </Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        {/* Scrollable Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-10">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex gap-6">
                                    {/* Thumbnail */}
                                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-gray-50">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            placeholder="blur"
                                            blurDataURL={PLACEHOLDER_IMAGE}
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide leading-relaxed line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500 font-light">Size: {item.size}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Minimalist Quantity Control */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors p-1"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-medium text-gray-900 w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="text-gray-400 hover:text-gray-900 transition-colors p-1"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            {/* Text-based Remove */}
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 bg-white p-6 border-t border-gray-100 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-base font-bold text-gray-900 uppercase tracking-wide">
                                    <p>Subtotal</p>
                                    <p>{formatPrice(totalPrice)}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center font-light">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>

                            <SheetClose asChild>
                                <Button
                                    className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] bg-gray-900 hover:bg-gray-800 text-white shadow-none transition-all"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </SheetClose>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
