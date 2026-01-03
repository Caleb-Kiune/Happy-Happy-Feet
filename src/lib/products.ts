// Product Data Layer - Fetches from Supabase
// Previously static array, now dynamic database queries

import { createServerSupabaseClient } from "./supabase-server";
import { createStaticClient } from "./supabase-static";
import { Product, CATEGORY_VALUES } from "./types";
// Export them so other files don't break immediately if they import from here (though we should update them)
// Actually, better to force update, but let's re-export to be safe or just import in other files.
// The plan said "Update src/lib/products.ts to import them".
// I will just import them for internal use, but I won't re-export them unless necessary.
// Wait, if I don't re-export, I break every file that imports { Product } from "@/lib/products".
// So I MUST re-export them.

export { CATEGORY_VALUES };
export type { Product, ProductCategory } from "./types";

/**
 * Get all product slugs for static generation (build-time)
 * Uses static client since there's no request context
 */
export async function getProductSlugsForStaticParams(): Promise<{ slug: string }[]> {
    const supabase = createStaticClient();

    const { data: products, error } = await supabase
        .from("products")
        .select("slug");

    if (error || !products) {
        console.error("Error fetching slugs for static params:", error);
        return [];
    }

    return products.map((p) => ({ slug: p.slug }));
}

// Database row types
type ProductRow = {
    id: string;
    slug: string;
    name: string;
    price: number;
    category: string; // Legacy column (kept for now)
    categories: string[]; // New array column
    sizes: string[];
    description: string | null;
    featured: boolean;
    created_at: string;
};

type ProductImageRow = {
    url: string;
    sort_order: number;
};

// Transform DB row to Product type
function transformProduct(
    row: ProductRow,
    images: ProductImageRow[]
): Product {
    // Fallback: If categories array is empty/null (migration lag), use the single category
    const categories = (row.categories && row.categories.length > 0)
        ? row.categories
        : (row.category ? [row.category] : []);

    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        price: row.price,
        categories: categories,
        sizes: row.sizes,
        description: row.description ?? undefined,
        featured: row.featured,
        createdAt: row.created_at,
        images: images
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((img) => img.url),
    };
}

/**
 * Get all products with their images
 */
export async function getAllProducts(): Promise<Product[]> {
    const supabase = await createServerSupabaseClient();

    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (productsError || !products) {
        console.error("Error fetching products:", productsError);
        return [];
    }

    const { data: images, error: imagesError } = await supabase
        .from("product_images")
        .select("product_id, url, sort_order");

    if (imagesError) {
        console.error("Error fetching images:", imagesError);
    }

    // Group images by product_id
    const imagesByProduct = new Map<string, ProductImageRow[]>();
    (images ?? []).forEach((img: { product_id: string; url: string; sort_order: number }) => {
        const existing = imagesByProduct.get(img.product_id) ?? [];
        existing.push({ url: img.url, sort_order: img.sort_order });
        imagesByProduct.set(img.product_id, existing);
    });

    return products.map((product) =>
        transformProduct(product, imagesByProduct.get(product.id) ?? [])
    );
}

/**
 * Get featured products only
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    const supabase = await createServerSupabaseClient();

    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true);

    if (productsError || !products) {
        console.error("Error fetching featured products:", productsError);
        return [];
    }

    const productIds = products.map((p) => p.id);

    const { data: images } = await supabase
        .from("product_images")
        .select("product_id, url, sort_order")
        .in("product_id", productIds);

    const imagesByProduct = new Map<string, ProductImageRow[]>();
    (images ?? []).forEach((img: { product_id: string; url: string; sort_order: number }) => {
        const existing = imagesByProduct.get(img.product_id) ?? [];
        existing.push({ url: img.url, sort_order: img.sort_order });
        imagesByProduct.set(img.product_id, existing);
    });

    return products.map((product) =>
        transformProduct(product, imagesByProduct.get(product.id) ?? [])
    );
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(
    slug: string
): Promise<Product | undefined> {
    const supabase = await createServerSupabaseClient();

    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !product) {
        return undefined;
    }

    const { data: images } = await supabase
        .from("product_images")
        .select("url, sort_order")
        .eq("product_id", product.id)
        .order("sort_order");

    return transformProduct(product, images ?? []);
}

/**
 * Get related products (same category, different slug)
 */
export async function getRelatedProducts(slug: string): Promise<Product[]> {
    const product = await getProductBySlug(slug);
    if (!product) return [];

    const supabase = await createServerSupabaseClient();

    // Find products that share at least one category with the current product
    // Postgres '&&' operator checks for array overlap
    const { data: related, error } = await supabase
        .from("products")
        .select("*")
        .overlaps("categories", product.categories) // Overlap check
        .neq("slug", slug)
        .limit(4);

    if (error || !related) {
        return [];
    }

    const productIds = related.map((p) => p.id);

    const { data: images } = await supabase
        .from("product_images")
        .select("product_id, url, sort_order")
        .in("product_id", productIds);

    const imagesByProduct = new Map<string, ProductImageRow[]>();
    (images ?? []).forEach((img: { product_id: string; url: string; sort_order: number }) => {
        const existing = imagesByProduct.get(img.product_id) ?? [];
        existing.push({ url: img.url, sort_order: img.sort_order });
        imagesByProduct.set(img.product_id, existing);
    });

    return related.map((product) =>
        transformProduct(product, imagesByProduct.get(product.id) ?? [])
    );
}

/**
 * Get all unique categories from products
 */
export async function getCategories(): Promise<string[]> {
    const supabase = await createServerSupabaseClient();

    const { data } = await supabase
        .from("products")
        .select("categories") // Fetch the array
        .order("categories");

    if (!data) return [];

    // Get unique categories from all arrays
    // Use flatMap to flatten the array of arrays, then Set to dedupe
    const allCategories = data.flatMap((d) => d.categories || []);
    const uniqueCategories = [...new Set(allCategories)];

    // Sort alphabetically
    return uniqueCategories.sort();
}