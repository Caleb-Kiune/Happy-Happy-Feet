export const CATEGORY_VALUES = ["block heels", "pencil heels", "flats", "wedge", "open"] as const;
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
    createdAt: string;
};
