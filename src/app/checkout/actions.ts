"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type ActionState = {
    error?: string;
    success?: boolean;
    orderId?: string;
};

// Input only needs ID and quantity. Price/Name will be fetched.
type OrderItemInput = {
    product_id: string;
    size: string;
    quantity: number;
    // Removed: price, product_name (we fetch these to ensure validity)
};

type CheckoutInput = {
    customer: {
        name: string;
        phone: string;
        location: string;
        notes?: string;
    };
    items: OrderItemInput[];
    // Removed: total (calculated server-side)
};

export async function createOrder(data: CheckoutInput): Promise<ActionState> {
    try {
        const supabase = createAdminClient();

        // 1. Fetch Products to get real prices
        const productIds = data.items.map((item) => item.product_id);
        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("id, name, price")
            .in("id", productIds);

        if (productsError || !products) {
            console.error("Product Lookup Error:", productsError);
            return { error: "Failed to verify product prices." };
        }

        // Create a map for easy lookup
        const productMap = new Map(products.map((p) => [p.id, p]));

        // 2. Rate Limiting Check
        const { headers } = await import("next/headers"); // Dynamic import for headers
        const headerStore = await headers();
        const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        // Check recent orders from this IP
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("ip_address", ip)
            .gte("created_at", fiveMinutesAgo);

        if (count && count >= 5) {
            return { error: "Too many attempts. Please try again later." };
        }

        // 3. Calculate Total & Prepare Order Items
        let calculatedTotal = 0;
        const validOrderItems = [];

        for (const item of data.items) {
            const product = productMap.get(item.product_id);

            if (!product) {
                // Product might have been deleted or invalid ID sent
                return { error: `Product with ID ${item.product_id} not found.` };
            }

            const itemTotal = product.price * item.quantity;
            calculatedTotal += itemTotal;

            validOrderItems.push({
                product_id: product.id,
                product_name: product.name, // Source of truth from DB
                size: item.size,
                quantity: item.quantity,
                price_at_purchase: product.price, // Trust DB price
            });
        }

        // 4. Create Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_name: data.customer.name,
                phone: data.customer.phone,
                location: data.customer.location,
                notes: data.customer.notes || null,
                total: calculatedTotal, // TRUSTED SERVER CALCULATION
                status: "pending",
                ip_address: ip,
            })
            .select("id")
            .single();

        if (orderError) {
            console.error("Order Creation Error:", orderError);
            return { error: "Failed to create order. Please try again." };
        }

        if (!order) {
            return { error: "Order creation failed (no data returned)." };
        }

        // 5. Save Order Items
        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(
                validOrderItems.map((item) => ({
                    ...item,
                    order_id: order.id,
                }))
            );

        if (itemsError) {
            console.error("Order Items Creation Error:", itemsError);
            // In a real app with RPC, we'd rollback. Here we log.
            return { error: "Failed to save order items." };
        }

        // 6. Revalidate Admin Dashboard
        revalidatePath("/admin/orders");

        return { success: true, orderId: order.id };
    } catch (error: any) {
        console.error("Unexpected Checkout Error:", error);
        return { error: "Failed to place order. Please try again later." };
    }
}
