"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export interface DashboardStats {
    totalProducts: number;
    pendingOrders: number;
    error?: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createServerSupabaseClient();

    // 1. Auth Check
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/admin/login");
    }

    try {
        // 2. Parallel Data Fetching
        // Use count: 'exact', head: true for minimal data transfer
        const [productsResult, ordersResult] = await Promise.all([
            supabase.from("products").select("*", { count: "exact", head: true }),
            supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("status", "pending"),
        ]);

        if (productsResult.error) throw productsResult.error;
        if (ordersResult.error) throw ordersResult.error;

        return {
            totalProducts: productsResult.count ?? 0,
            pendingOrders: ordersResult.count ?? 0,
            error: false,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalProducts: 0,
            pendingOrders: 0,
            error: true,
        };
    }
}
