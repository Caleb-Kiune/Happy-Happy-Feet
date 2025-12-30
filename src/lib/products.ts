// Product Data Layer - Fetches from Supabase
// Previously static array, now dynamic database queries

import { createServerSupabaseClient } from "./supabase-server";
import { createStaticClient } from "./supabase-static";

export const CATEGORY_VALUES = ["heels", "flats", "wedge", "open"] as const;
export type ProductCategory = typeof CATEGORY_VALUES[number];

export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number;
    // Allow strict union for new types but string for legacy data compatibility
    category: ProductCategory | string;
    images: string[];
    sizes: string[];
    description?: string;
    featured?: boolean;
};

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
    category: string; // Database returns string
    sizes: string[];
    description: string | null;
    featured: boolean;
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
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        price: row.price,
        category: row.category,
        sizes: row.sizes,
        description: row.description ?? undefined,
        featured: row.featured,
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

    const { data: related, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
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
        .select("category")
        .order("category");

    if (!data) return [];

    // Get unique categories
    const categories = [...new Set(data.map((d) => d.category))];
    return categories;
}