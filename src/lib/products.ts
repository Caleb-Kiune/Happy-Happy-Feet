export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number; // in cents or lowest currency unit
    category: "heels" | "sandals" | "sneakers" | "flats";
    images: string[];
    description?: string;
    featured?: boolean;
};

export const products: Product[] = [
    // Heels
    {
        id: "h1",
        slug: "classic-black-pumps",
        name: "Classic Black Pumps",
        price: 4999,
        category: "heels",
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop"],
        featured: true,
    },
    {
        id: "h2",
        slug: "nude-block-heels",
        name: "Nude Block Heels",
        price: 5499,
        category: "heels",
        images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        id: "h3",
        slug: "red-stilettos",
        name: "Statement Red Stilettos",
        price: 6999,
        category: "heels",
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop"],
    },

    // Sandals
    {
        id: "s1",
        slug: "summer-strappy-sandals",
        name: "Summer Strappy Sandals",
        price: 2999,
        category: "sandals",
        images: ["https://images.unsplash.com/photo-1603487742131-4160d699908f?q=80&w=1000&auto=format&fit=crop"],
        featured: true,
    },
    {
        id: "s2",
        slug: "tan-leather-slides",
        name: "Tan Leather Slides",
        price: 3499,
        category: "sandals",
        images: ["https://images.unsplash.com/photo-1621255567362-e9c8f2f65b12?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        id: "s3",
        slug: "white-platform-sandals",
        name: "White Platform Sandals",
        price: 3999,
        category: "sandals",
        images: ["https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop"],
    },

    // Sneakers
    {
        id: "sn1",
        slug: "minimal-white-sneakers",
        name: "Minimal White Sneakers",
        price: 4499,
        category: "sneakers",
        images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"],
        featured: true,
    },
    {
        id: "sn2",
        slug: "blush-pink-trainers",
        name: "Blush Pink Trainers",
        price: 4999,
        category: "sneakers",
        images: ["https://images.unsplash.com/photo-1555529733-UE16a80226c3?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        id: "sn3",
        slug: "retro-high-tops",
        name: "Retro High Tops",
        price: 5999,
        category: "sneakers",
        images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop"],
    },

    // Flats
    {
        id: "f1",
        slug: "classic-ballet-flats",
        name: "Classic Ballet Flats",
        price: 2499,
        category: "flats",
        images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop"],
        featured: true,
    },
    {
        id: "f2",
        slug: "pointed-toe-loafers",
        name: "Pointed Toe Loafers",
        price: 3999,
        category: "flats",
        images: ["https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        id: "f3",
        slug: "suede-mules",
        name: "Chic Suede Mules",
        price: 3499,
        category: "flats",
        images: ["https://images.unsplash.com/photo-1582142203794-b148007a9761?q=80&w=1000&auto=format&fit=crop"],
    }
];

export function getAllProducts() {
    return products;
}

export function getFeaturedProducts() {
    return products.filter((p) => p.featured);
}
