"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
};

// --- READ ---
export async function getCategories() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return data as Category[];
}

// --- CREATE ---
export async function createCategory(formData: FormData) {
    const supabase = await createServerSupabaseClient();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // Auto-generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Validation
    if (!name || name.trim().length < 3) {
        return { error: "Name must be at least 3 characters" };
    }

    const { error } = await supabase
        .from("categories")
        .insert({ name: name.trim(), slug, description: description?.trim() });

    if (error) {
        if (error.code === '23505') return { error: "Category already exists" }; // Unique violation
        return { error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    return { success: true };
}

// --- UPDATE (RENAME via RPC) ---
export async function updateCategory(id: string, oldName: string, formData: FormData) {
    const supabase = await createServerSupabaseClient();
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (!name || name.trim().length < 3) {
        return { error: "Name must be at least 3 characters" };
    }

    // Call the RPC function for transactional update
    const { error } = await supabase.rpc("rename_category", {
        old_name: oldName,
        new_name: name.trim(),
        new_slug: slug,
    });

    if (error) {
        console.error("RPC Error:", error);
        // Fallback if RPC fails or not exists (though user should have run migration)
        // Try direct update but warn about consistency
        const { error: directError } = await supabase
            .from("categories")
            .update({ name: name.trim(), slug })
            .eq("id", id);

        if (directError) return { error: directError.message };
        return { success: true, warning: "Simple update performed (RPC failed)" };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
}

// --- DELETE ---
export async function deleteCategory(id: string, name: string) {
    const supabase = await createServerSupabaseClient();

    // Check usage
    const { count, error: checkError } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .contains("categories", [name]);

    if (checkError) return { error: checkError.message };

    if (count && count > 0) {
        return { error: `Cannot delete: ${count} products use this category.` };
    }

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    return { success: true };
}
