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
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
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
        // Optional: toast("Quantity updated", {  position: "bottom-center" }); 
        // Commented out to prevent toast spamming while clicking + rapidly
    };

    const handleRemoveItem = (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
        toast("Item removed", {
            description: "The item has been removed from your cart.",
            action: {
                label: "Undo",
                onClick: () => console.log("Undo not implemented yet for simplicity"),
            },
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
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-6 w-6" />
                    {totalItems > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                        >
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md border-l border-gray-100 bg-white p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-gray-50 flex-shrink-0">
                    <SheetTitle className="text-left font-sans text-xl font-bold tracking-tight text-gray-900">
                        Your Cart {totalItems > 0 && `(${totalItems})`}
                    </SheetTitle>
                </SheetHeader>

                {state.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <ShoppingBag className="h-16 w-16 text-gray-200 stroke-1" />
                        <div className="space-y-2">
                            <p className="text-xl font-medium text-gray-900">Your cart is empty</p>
                            <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                        </div>
                        <SheetClose asChild>
                            <Button
                                variant="outline"
                                onClick={handleStartShopping}
                                className="min-w-[140px]"
                            >
                                Start Shopping
                            </Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        {/* Scrollable Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-gray-100 bg-gray-50">
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
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-gray-500">Size: {item.size}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-none"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-none"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-transparent"
                                                onClick={() => handleRemoveItem(item.id)}
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Footer */}
                        <div className="flex-shrink-0 bg-gray-50/50 p-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-center justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>{formatPrice(totalPrice)}</p>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Taxes and shipping calculated at checkout.
                            </p>
                            <SheetClose asChild>
                                <Button
                                    className="w-full rounded-full py-6 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white"
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
