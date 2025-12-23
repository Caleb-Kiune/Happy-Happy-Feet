"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from "react";

// --- Types ---

export type CartItem = {
    id: string;      // Unique identifier (e.g., product.id + size)
    slug: string;
    name: string;
    price: number;   // Price in smallest unit (e.g., KES cents or exact KES)
    image: string;
    size: string;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "REMOVE_ITEM"; payload: { id: string } }
    | { type: "CLEAR_CART" };

type CartContextType = {
    state: CartState;
    dispatch: Dispatch<CartAction>;
    totalItems: number;
    totalPrice: number;
};

// --- Initial State ---

const initialState: CartState = {
    items: [],
};

// --- Reducer ---

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            }

            return {
                ...state,
                items: [...state.items, action.payload],
            };
        }
        case "UPDATE_QUANTITY": {
            const { id, quantity } = action.payload;
            // If quantity is 0 or less, remove the item
            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter((item) => item.id !== id),
                };
            }
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                ),
            };
        }
        case "REMOVE_ITEM": {
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
            };
        }
        case "CLEAR_CART": {
            return initialState;
        }
        default:
            return state;
    }
}

// --- Context ---

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider ---

const CART_STORAGE_KEY = "happy_feet_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    // Initialize state from localStorage if available
    const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem(CART_STORAGE_KEY);
                return stored ? JSON.parse(stored) : initial;
            } catch (error) {
                console.error("Failed to load cart from localStorage:", error);
                return initial;
            }
        }
        return initial;
    });

    // Persist to localStorage whenever state changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
            } catch (error) {
                console.error("Failed to save cart to localStorage:", error);
            }
        }
    }, [state]);

    // Derived state for easy access
    const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

// --- Hook ---

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
