
import { createServerSupabaseClient } from "./supabase-server";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    size: string;
    quantity: number;
    price_at_purchase: number;
    // Optional: Include product image if we join with products table
    product_image?: string;
};

export type Order = {
    id: string;
    customer_name: string;
    phone: string;
    location: string;
    notes: string | null;
    total: number;
    status: OrderStatus;
    created_at: string;
    items?: OrderItem[];
};

/**
 * Get all orders, sorted by newest first
 */
export async function getAllOrders(): Promise<Order[]> {
    const supabase = await createServerSupabaseClient();

    const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error || !orders) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return orders as Order[];
}

/**
 * Get a single order by ID with its items
 */
export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = await createServerSupabaseClient();

    // Fetch Order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    if (orderError || !order) {
        console.error("Error fetching order:", orderError);
        return null;
    }

    // Fetch Items (and join with products to get image)
    // Note: We need to do a manual join or two queries since Supabase join syntax with type casting can be tricky
    // Let's do two queries for simplicity and reliability
    const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
            *,
            products (
                images: product_images(url)
            )
        `)
        .eq("order_id", id);

    if (itemsError) {
        console.error("Error fetching order items:", itemsError);
    }

    // Transform items to include the first image URL if available
    const orderItems: OrderItem[] = (items || []).map((item: any) => {
        // Safe navigation for nested join structure: products -> images -> [0] -> url
        // Note: product_images returns an array. We usually sort by sort_order but simple fetch is okay here.
        const imageUrl = item.products?.images?.[0]?.url;

        return {
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product_image: imageUrl
        };
    });

    return {
        ...order,
        items: orderItems,
    } as Order;
}
