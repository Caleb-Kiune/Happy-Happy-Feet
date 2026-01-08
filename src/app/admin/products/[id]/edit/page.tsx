import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/products/actions";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { notFound } from "next/navigation";

// Since fetching by ID isn't directly exposed in lib/products (it uses getAllProducts or getProductBySlug),
// we might need to update lib/products to fetch by ID or just use getAllProducts().find() for now since dataset is small.
// A better way is to update lib/products.ts to allow fetching by ID or directly query supabase here. 
// Given the current architecture, I'll direct query supabase here since it's an admin page and we want fresh data.

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getCategories } from "@/app/admin/categories/actions";

// We need a helper to fetch by ID specifically for the Edit page
async function getProductById(id: string) {
    const supabase = await createServerSupabaseClient();

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (!product) return null;

    const { data: images } = await supabase
        .from("product_images")
        .select("url, sort_order")
        .eq("product_id", id)
        .order("sort_order");

    return {
        ...product,
        images: images?.map(i => i.url) || []
    };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);
    const categories = await getCategories();

    if (!product) {
        notFound();
    }

    const updateProductWithId = updateProduct.bind(null, id);

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#111111]">Edit Product</h1>
                <p className="text-sm text-[#666666] mt-1">Update details for {product.name}</p>
            </div>

            <ProductForm
                initialData={product}
                action={updateProductWithId}
                availableCategories={categories}
            />
        </div>
    );
}
