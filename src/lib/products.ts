// Product Data
// Note: Currently using Unsplash images for demo. 
// To use local images:
// 1. Upload images to /public/images/products/
// 2. Update the 'images' array for each product to use local paths, e.g., "/images/products/my-shoe-1.jpg"

// Optimized Unsplash parameters (DRY)
const OPTIMIZE = "?q=80&w=1000&auto=format&fit=crop";

export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number; // in Kenyan Shillings (or lowest unit)
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
            `https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsYXNzaWMlMjBibGFjayUyMHB1bXBzJTIwaGVlbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsYXNzaWMlMjBibGFjayUyMHB1bXBzJTIwaGVlbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsYXNzaWMlMjBibGFjayUyMHB1bXBzJTIwaGVlbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1543163521-1bf539c55dd2${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1543163521-1bf539c55dd2${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1543163521-1bf539c55dd2${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1542185185-47838d6b00c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFN0YXRlbWVudCUyMFJlZCUyMFN0aWxldHRvc3xlbnwwfHwwfHx8Mg%3D%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1542185185-47838d6b00c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFN0YXRlbWVudCUyMFJlZCUyMFN0aWxldHRvc3xlbnwwfHwwfHx8Mg%3D%3D${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1728973702902-9cd4c75eebdb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3VtbWVyJTIwU3RyYXBweSUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1728973702902-9cd4c75eebdb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3VtbWVyJTIwU3RyYXBweSUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1568347619798-2008f2ce5b94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGFuJTIwTGVhdGhlciUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1568347619798-2008f2ce5b94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGFuJTIwTGVhdGhlciUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1702413094780-4bfd4b0d873c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFdoaXRlJTIwUGxhdGZvcm0lMjBTYW5kYWxzfGVufDB8fDB8fHwy${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1702413094780-4bfd4b0d873c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFdoaXRlJTIwUGxhdGZvcm0lMjBTYW5kYWxzfGVufDB8fDB8fHwy${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1702413094780-4bfd4b0d873c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFdoaXRlJTIwUGxhdGZvcm0lMjBTYW5kYWxzfGVufDB8fDB8fHwy${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1560769629-975ec94e6a86${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1572293276811-1f27592be0a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qmx1c2glMjBQaW5rJTIwVHJhaW5lcnN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1521093470119-a3acdc43374a${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2${OPTIMIZE}`
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
        images: [
            `https://images.unsplash.com/photo-1560769629-975ec94e6a86${OPTIMIZE}`
        ],
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
            `https://images.unsplash.com/photo-1560343090-f0409e92791a${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1560343090-f0409e92791a${OPTIMIZE}`
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
            `https://images.unsplash.com/photo-1511556820780-d912e42b4980${OPTIMIZE}`,
            `https://images.unsplash.com/photo-1511556820780-d912e42b4980${OPTIMIZE}`
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
        images: [
            `https://images.unsplash.com/photo-1608629601270-a0007becead3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENoaWMlMjBTdWVkZSUyME11bGVzJTIwc2hvZXN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`
        ],
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
    return products
        .filter((p) => p.category === product.category && p.slug !== slug)
        .slice(0, 4);
} 