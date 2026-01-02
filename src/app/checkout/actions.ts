"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type ActionState = {
    error?: string;
    success?: boolean;
    orderId?: string;
};

type OrderItemInput = {
    product_id: string; // The ID from the products table (UUID)
    product_name: string;
    size: string;
    quantity: number;
    price: number;
};

type CheckoutInput = {
    customer: {
        name: string;
        phone: string;
        location: string;
        notes?: string;
    };
    items: OrderItemInput[];
    total: number;
};

export async function createOrder(data: CheckoutInput): Promise<ActionState> {
    const supabase = createAdminClient();

    try {
        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_name: data.customer.name,
                phone: data.customer.phone,
                location: data.customer.location,
                notes: data.customer.notes || null,
                total: data.total,
                status: "pending",
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

        // 2. Create Order Items
        const orderItems = data.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id, // Ensure this matches DB type (UUID)
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price_at_purchase: item.price,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Order Items Creation Error:", itemsError);
            // Ideally we should rollback here, but Supabase HTTP CRUD doesn't support transactions easily without RPC.
            // For now, we log it. In production, use RPC for transaction.
            return { error: "Failed to save order items." };
        }

        // 3. Revalidate Admin Dashboard
        revalidatePath("/admin/orders");

        return { success: true, orderId: order.id };
    } catch (error: any) {
        console.error("Unexpected Checkout Error:", error);
        return { error: error.message || "An unexpected error occurred." };
    }
}
