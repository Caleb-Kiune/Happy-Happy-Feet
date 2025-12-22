export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number; // in cents or lowest currency unit
    category: "heels" | "sandals" | "sneakers" | "flats";
    images: string[];
    sizes: string[];
    description?: string;
    featured?: boolean;
};

export const products: Product[] = [
    // Heels (Sizes 36-41)
    {
        id: "h1",
        slug: "classic-black-pumps",
        name: "Classic Black Pumps",
        price: 4999,
        category: "heels",
        images: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596568297771-346765d752ee?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39", "40", "41"],
        featured: true,
        description: "Timeless elegance meets modern comfort in our Classic Black Pumps. Featuring a perfect 3-inch heel and cushioned insole for all-day wear.",
    },
    {
        id: "h2",
        slug: "nude-block-heels",
        name: "Nude Block Heels",
        price: 5499,
        category: "heels",
        images: [
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605763240004-741a4a4d651d?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39", "40"],
        description: "Versatile and chic, these Nude Block Heels are your go-to for both office days and weekend brunches. The sturdy block heel ensures stability.",
    },
    {
        id: "h3",
        slug: "red-stilettos",
        name: "Statement Red Stilettos",
        price: 6999,
        category: "heels",
        images: [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["37", "38", "39", "40"],
        description: "Make a bold entrance with our Statement Red Stilettos. Crafted from premium materials designed to turn heads.",
    },

    // Sandals (Sizes 36-42)
    {
        id: "s1",
        slug: "summer-strappy-sandals",
        name: "Summer Strappy Sandals",
        price: 2999,
        category: "sandals",
        images: [
            "https://images.unsplash.com/photo-1603487742131-4160d699908f?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1545624795-c1e1946dc6cf?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        featured: true,
        description: "Light, airy, and effortlessly stylish. These strappy sandals are the ultimate summer companion.",
    },
    {
        id: "s2",
        slug: "tan-leather-slides",
        name: "Tan Leather Slides",
        price: 3499,
        category: "sandals",
        images: [
            "https://images.unsplash.com/photo-1621255567362-e9c8f2f65b12?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1615525546687-3531cb482813?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["37", "38", "39", "40", "41"],
        description: "Minimalist luxury. Our Tan Leather Slides feature soft, genuine leather that molds to your feet.",
    },
    {
        id: "s3",
        slug: "white-platform-sandals",
        name: "White Platform Sandals",
        price: 3999,
        category: "sandals",
        images: [
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562273138-f46be4ebdf6c?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39"],
        description: "Elevate your look literally and figuratively with these trendy White Platform Sandals. Comfortable height for everyday wear.",
    },

    // Sneakers (Sizes 37-41)
    {
        id: "sn1",
        slug: "minimal-white-sneakers",
        name: "Minimal White Sneakers",
        price: 4499,
        category: "sneakers",
        images: [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["37", "38", "39", "40", "41"],
        featured: true,
        description: "The essential white sneaker. Clean lines, premium materials, and versatile enough to pair with dresses or jeans.",
    },
    {
        id: "sn2",
        slug: "blush-pink-trainers",
        name: "Blush Pink Trainers",
        price: 4999,
        category: "sneakers",
        images: [
            "https://images.unsplash.com/photo-1555529733-UE16a80226c3?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521093470119-a3acdc43374a?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39", "40"],
        description: "Add a soft touch of color to your sporty look with our functional yet fashionable Blush Pink Trainers.",
    },
    {
        id: "sn3",
        slug: "retro-high-tops",
        name: "Retro High Tops",
        price: 5999,
        category: "sneakers",
        images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["37", "38", "39", "40"],
        description: "Vintage vibes for the modern woman. These Retro High Tops bring a nostalgic flair to your casual wardrobe.",
    },

    // Flats (Sizes 36-41)
    {
        id: "f1",
        slug: "classic-ballet-flats",
        name: "Classic Ballet Flats",
        price: 2499,
        category: "flats",
        images: [
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1535639684361-88c46387532a?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["36", "37", "38", "39", "40", "41"],
        featured: true,
        description: "Simple, sophisticated, and surprisingly comfortable. The Classic Ballet Flat is a wardrobe staple.",
    },
    {
        id: "f2",
        slug: "pointed-toe-loafers",
        name: "Pointed Toe Loafers",
        price: 3999,
        category: "flats",
        images: [
            "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1624638763788-107315570220?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["37", "38", "39", "40"],
        description: "Professional polish without the heel. Sharp, structured, and perfect for the 9-to-5.",
    },
    {
        id: "f3",
        slug: "suede-mules",
        name: "Chic Suede Mules",
        price: 3499,
        category: "flats",
        images: ["https://images.unsplash.com/photo-1582142203794-b148007a9761?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["36", "37", "38", "39", "40"],
        description: "Slide into style. These Suede Mules offer an effortless chic look that works with everything.",
    }
];

export function getAllProducts() {
    return products;
}

export function getFeaturedProducts() {
    return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string) {
    return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string) {
    const product = getProductBySlug(slug);
    if (!product) return [];
    // Return other products in same category, excluding self
    return products
        .filter((p) => p.category === product.category && p.slug !== slug)
        .slice(0, 4);
}
