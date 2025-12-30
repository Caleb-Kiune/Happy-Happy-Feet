"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/lib/products";

export type ActionState = {
    error?: string;
    success?: boolean;
};

// ... existing ActionState definition ...

export async function quickUpdateProduct(id: string, updates: Partial<Product>): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    try {
        // Filter out fields that shouldn't be updated directly or need transformation if any
        // For now, we trust the Partial<Product> matches DB columns mostly, 
        // but let's be explicit about what we allow to be safe.
        const safeUpdates: any = {};
        if (updates.name !== undefined) safeUpdates.name = updates.name;
        if (updates.price !== undefined) safeUpdates.price = updates.price;
        if (updates.category !== undefined) safeUpdates.category = updates.category;
        if (updates.featured !== undefined) safeUpdates.featured = updates.featured;
        if (updates.sizes !== undefined) safeUpdates.sizes = updates.sizes;

        if (Object.keys(safeUpdates).length === 0) {
            return { success: true }; // Nothing to update
        }

        const { error } = await supabase
            .from("products")
            .update(safeUpdates)
            .eq("id", id);

        if (error) throw error;

    } catch (error: any) {
        console.error("Quick Update Error:", error);
        return { error: error.message || "Failed to update product" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
}

// Types
// Types
// ActionState is defined at the top of the file


export async function createProduct(currentState: ActionState | null, formData: FormData): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    // Extract Data
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const sizes = (formData.get("sizes") as string).split(",").filter(Boolean);
    const featured = formData.get("featured") === "on";
    const imageUrls = (formData.get("imageUrls") as string).split(",").filter(Boolean);

    // Basic Validation
    if (!name || !slug || !price || !category || imageUrls.length === 0) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Insert Product
        const { data: product, error: productError } = await supabase
            .from("products")
            .insert({
                name,
                slug,
                description,
                price,
                category,
                sizes,
                featured,
            })
            .select()
            .single();

        if (productError) throw productError;

        // 2. Insert Images
        const imageInserts = imageUrls.map((url, index) => ({
            product_id: product.id,
            url,
            sort_order: index,
        }));

        const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageInserts);

        if (imagesError) throw imagesError;

    } catch (error: any) {
        console.error("Create Product Error:", error);
        return { error: error.message || "Failed to create product" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop"); // Revalidate public shop
    revalidatePath("/"); // Revalidate home if featured
    redirect("/admin/products");
}

export async function updateProduct(id: string, currentState: ActionState | null, formData: FormData): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const sizes = (formData.get("sizes") as string).split(",").filter(Boolean);
    const featured = formData.get("featured") === "on";
    const imageUrls = (formData.get("imageUrls") as string).split(",").filter(Boolean);

    if (!name || !slug || !price || !category || imageUrls.length === 0) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Update Product
        const { error: productError } = await supabase
            .from("products")
            .update({
                name,
                slug,
                description,
                price,
                category,
                sizes,
                featured,
            })
            .eq("id", id);

        if (productError) throw productError;

        // 2. Sync Images (Delete all and re-insert for consistency)
        const { error: deleteError } = await supabase
            .from("product_images")
            .delete()
            .eq("product_id", id);

        if (deleteError) throw deleteError;

        const imageInserts = imageUrls.map((url, index) => ({
            product_id: id,
            url,
            sort_order: index,
        }));

        const { error: insertError } = await supabase
            .from("product_images")
            .insert(imageInserts);

        if (insertError) throw insertError;

    } catch (error: any) {
        console.error("Update Product Error:", error);
        return { error: error.message || "Failed to update product" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    try {
        // Cascade delete should handle images if set up in DB, 
        // but explicitly deleting images first is safer if not sure.
        await supabase.from("product_images").delete().eq("product_id", id);

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return { error: error.message || "Failed to delete product" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
}

export async function deleteProducts(ids: string[]): Promise<ActionState> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    if (!ids || ids.length === 0) return { error: "No products selected" };

    try {
        // 1. Fetch Images to delete from Storage
        const { data: images } = await supabase
            .from("product_images")
            .select("url")
            .in("product_id", ids);

        if (images && images.length > 0) {
            const pathsToDelete = images
                .map((img) => {
                    // Extract path: "https://.../product-images/folder/file.jpg" -> "folder/file.jpg"
                    // Or "file.jpg" if root.
                    const url = new URL(img.url);
                    const pathParts = url.pathname.split("/product-images/");
                    return pathParts.length > 1 ? pathParts[1] : null;
                })
                .filter((p): p is string => p !== null);

            if (pathsToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("product-images")
                    .remove(pathsToDelete);

                if (storageError) {
                    console.error("Storage Batch Delete Error:", storageError);
                    // Continue to delete DB records even if storage fails slightly
                }
            }
        }

        // 2. Delete Images from DB (Explicit)
        await supabase.from("product_images").delete().in("product_id", ids);

        // 3. Delete Products
        const { error } = await supabase
            .from("products")
            .delete()
            .in("id", ids);

        if (error) throw error;

    } catch (error: any) {
        console.error("Bulk Delete Error:", error);
        return { error: error.message || "Failed to delete products" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
}
