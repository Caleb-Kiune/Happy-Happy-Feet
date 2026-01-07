"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/lib/orders";

export type ActionState = {
    error?: string;
    success?: boolean;
};

const ALLOWED_STATUSES: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled"
];

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auht Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    // Validation
    if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
        return { error: "Invalid status" };
    }

    try {
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) {
            console.error("Update Order Status Error:", error);
            throw error;
        }

    } catch (error: any) {
        return { error: error.message || "Failed to update order status" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
}

export async function deleteOrders(ids: string[]): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    if (!ids || ids.length === 0) return { error: "No orders selected" };

    try {
        // Cascade delete should handle order_items automatically via foreign keys
        // But we wrap in try/catch to be safe
        const { error } = await supabase
            .from("orders")
            .delete()
            .in("id", ids);

        if (error) throw error;

    } catch (error: any) {
        console.error("Bulk Delete Orders Error:", error);
        return { error: error.message || "Failed to delete orders" };
    }

    revalidatePath("/admin/orders");
    return { success: true };
}
