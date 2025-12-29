/**
 * Migration Script: Insert products from static file to Supabase
 * 
 * BEFORE RUNNING:
 * 1. Run schema.sql in Supabase SQL Editor
 * 2. Temporarily disable RLS on products and product_images:
 *    ALTER TABLE products DISABLE ROW LEVEL SECURITY;
 *    ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
 * 
 * RUN: npx tsx scripts/migrate-products.ts
 * 
 * AFTER RUNNING (re-enable RLS):
 *    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
 *    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
 */

import { createClient } from "@supabase/supabase-js";

// Use anon key since RLS is disabled
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables!");
    console.error("Make sure .env.local is loaded or set vars manually.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// PRODUCT DATA (copied from products.ts)
// ============================================

const OPTIMIZE = "?q=80&w=1000&auto=format&fit=crop";

const IMG = {
    heels: [
        `https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsYXNzaWMlMjBibGFjayUyMHB1bXBzJTIwaGVlbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1543163521-1bf539c55dd2${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1542185185-47838d6b00c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFN0YXRlbWVudCUyMFJlZCUyMFN0aWxldHRvc3xlbnwwfHwwfHx8Mg%3D%3D${OPTIMIZE}`,
    ],
    sandals: [
        `https://images.unsplash.com/photo-1728973702902-9cd4c75eebdb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3VtbWVyJTIwU3RyYXBweSUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1568347619798-2008f2ce5b94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGFuJTIwTGVhdGhlciUyMFNhbmRhbHN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1702413094780-4bfd4b0d873c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFdoaXRlJTIwUGxhdGZvcm0lMjBTYW5kYWxzfGVufDB8fDB8fHwy${OPTIMIZE}`,
    ],
    sneakers: [
        `https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1572293276811-1f27592be0a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qmx1c2glMjBQaW5rJTIwVHJhaW5lcnN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1560769629-975ec94e6a86${OPTIMIZE}`,
    ],
    flats: [
        `https://images.unsplash.com/photo-1560343090-f0409e92791a${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1511556820780-d912e42b4980${OPTIMIZE}`,
        `https://images.unsplash.com/photo-1608629601270-a0007becead3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENoaWMlMjBTdWVkZSUyME11bGVzJTIwc2hvZXN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
    ],
    boots: [
        `https://images.unsplash.com/photo-1608629601270-a0007becead3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENoaWMlMjBTdWVkZSUyME11bGVzJTIwc2hvZXN8ZW58MHx8MHx8fDI%3D${OPTIMIZE}`,
    ],
};

type Category = "heels" | "sandals" | "sneakers" | "flats" | "boots";

interface ProductData {
    slug: string;
    name: string;
    price: number;
    category: Category;
    sizes: string[];
    description: string;
    featured: boolean;
    images: string[];
}

const createProduct = (
    i: number,
    cat: Category,
    nameBase: string,
    price: number,
    featured = false
): ProductData => ({
    slug: `${nameBase.toLowerCase().replace(/ /g, "-")}-${i}`,
    name: nameBase,
    price,
    category: cat,
    images: [IMG[cat][i % IMG[cat].length], IMG[cat][(i + 1) % IMG[cat].length]],
    sizes:
        cat === "sneakers" || cat === "boots"
            ? ["37", "38", "39", "40", "41"]
            : ["36", "37", "38", "39", "40"],
    description: `Experience perfect comfort and style with our ${nameBase}. Designed for the modern woman who values both elegance and ease.`,
    featured,
});

const generateProducts = (): ProductData[] => {
    const allProducts: ProductData[] = [];

    // HEELS (20 items)
    const heelsData = [
        { n: "Classic Black Pumps", p: 4999, f: true },
        { n: "Nude Block Heels", p: 5499, f: false },
        { n: "Red Statement Stilettos", p: 6999, f: false },
        { n: "Midnight Velvet Pumps", p: 5800, f: false },
        { n: "Silver Glitter Heels", p: 7500, f: true },
        { n: "Office Comfort Heels", p: 3500, f: false },
        { n: "Strappy Evening Heels", p: 8999, f: false },
        { n: "Rose Gold Sandals", p: 6200, f: false },
        { n: "White Wedding Pumps", p: 9500, f: false },
        { n: "Navy Blue Courts", p: 4500, f: false },
        { n: "Tan Work Heels", p: 3999, f: false },
        { n: "Leopard Print Stilettos", p: 7800, f: false },
        { n: "Chunky Platform Heels", p: 6500, f: false },
        { n: "Satin Bow Pumps", p: 5200, f: false },
        { n: "Clear Strap Heels", p: 4800, f: false },
        { n: "Gold Metallic Heels", p: 7200, f: false },
        { n: "Burgundy Velvet Heels", p: 5900, f: false },
        { n: "Emerald Green Pumps", p: 6100, f: false },
        { n: "Low Kitten Heels", p: 3200, f: false },
        { n: "Designer Inspired Heels", p: 12500, f: true },
    ];
    heelsData.forEach((d, i) =>
        allProducts.push(createProduct(i + 1, "heels", d.n, d.p, d.f))
    );

    // SANDALS (20 items)
    const sandalsData = [
        { n: "Summer Strappy Sandals", p: 2999, f: true },
        { n: "Tan Leather Slides", p: 3499, f: false },
        { n: "White Platform Sandals", p: 3999, f: false },
        { n: "Greek Goddess Gladiators", p: 4500, f: false },
        { n: "Boho Fringe Sandals", p: 3200, f: false },
        { n: "Beach Ready Flip Flops", p: 2500, f: false },
        { n: "Metallic Gold Slides", p: 3800, f: false },
        { n: "Comfort Walk Sandals", p: 4200, f: false },
        { n: "Jeweled Evening Sandals", p: 6500, f: false },
        { n: "Woven Leather Mules", p: 5500, f: false },
        { n: "Espadrille Wedges", p: 5999, f: false },
        { n: "Cork Sole Sandals", p: 4800, f: false },
        { n: "Minimalist Black Slides", p: 3100, f: false },
        { n: "Rope Tie Sandals", p: 3600, f: false },
        { n: "Luxury Resin Slides", p: 8500, f: true },
        { n: "Bridal Pearl Sandals", p: 7800, f: false },
        { n: "Chunky Sport Sandals", p: 5200, f: false },
        { n: "Ankle Strap Flats", p: 3300, f: false },
        { n: "Python Print Sandals", p: 4600, f: false },
        { n: "Velvet Pool Slides", p: 6200, f: false },
    ];
    sandalsData.forEach((d, i) =>
        allProducts.push(createProduct(i + 1, "sandals", d.n, d.p, d.f))
    );

    // SNEAKERS (20 items)
    const sneakersData = [
        { n: "Minimal White Sneakers", p: 4499, f: true },
        { n: "Blush Pink Trainers", p: 4999, f: false },
        { n: "Retro High Tops", p: 5999, f: false },
        { n: "Urban Grey Runners", p: 5500, f: false },
        { n: "Chunky Dad Sneakers", p: 6500, f: false },
        { n: "Canvas Slip Ons", p: 3500, f: false },
        { n: "Performance Sport Shoes", p: 7200, f: false },
        { n: "Limited Edition Kicks", p: 14500, f: true },
        { n: "Metallic Silver Sneakers", p: 5800, f: false },
        { n: "Pastel Colorblock Trainers", p: 5200, f: false },
        { n: "Black Knit Runners", p: 4800, f: false },
        { n: "Platform Canvas Shoes", p: 4200, f: false },
        { n: "Gum Sole Sneakers", p: 5600, f: false },
        { n: "Vintage Court Shoes", p: 6800, f: false },
        { n: "Neon Accent Trainers", p: 5400, f: false },
        { n: "Luxury Leather Sneakers", p: 9800, f: false },
        { n: "High Fashion Runners", p: 11000, f: false },
        { n: "Everyday Walking Shoes", p: 3900, f: false },
        { n: "Mesh Breathable Sneakers", p: 4100, f: false },
        { n: "Suede Detail Trainers", p: 6300, f: false },
    ];
    sneakersData.forEach((d, i) =>
        allProducts.push(createProduct(i + 1, "sneakers", d.n, d.p, d.f))
    );

    // FLATS (20 items)
    const flatsData = [
        { n: "Classic Ballet Flats", p: 2499, f: true },
        { n: "Pointed Toe Loafers", p: 3999, f: false },
        { n: "Chic Suede Mules", p: 3499, f: false },
        { n: "Patent Leather Mary Janes", p: 4500, f: false },
        { n: "Leopard Print Flats", p: 3200, f: false },
        { n: "Nude Everyday Flats", p: 2800, f: false },
        { n: "Black Office Loafers", p: 4200, f: false },
        { n: "Metallic Silver Ballerinas", p: 3100, f: false },
        { n: "Quilted Leather Flats", p: 5500, f: false },
        { n: "Tassel Driving Shoes", p: 4800, f: false },
        { n: "Slingback Flats", p: 3600, f: false },
        { n: "Embroidered Mules", p: 5200, f: false },
        { n: "Velvet Smoking Slippers", p: 5800, f: false },
        { n: "Two Tone Chanel Style", p: 6500, f: false },
        { n: "Studded Caged Flats", p: 6900, f: false },
        { n: "Soft Leather Moccasins", p: 4100, f: false },
        { n: "Croc Effect Loafers", p: 4600, f: false },
        { n: "Designer Look Flats", p: 8900, f: true },
        { n: "Canvas Espadrilles", p: 2900, f: false },
        { n: "Bow Detail Flats", p: 3300, f: false },
    ];
    flatsData.forEach((d, i) =>
        allProducts.push(createProduct(i + 1, "flats", d.n, d.p, d.f))
    );

    // BOOTS (20 items)
    const bootsData = [
        { n: "Brown Suede Boots", p: 3499, f: false },
        { n: "Classic Chelsea Boots", p: 4999, f: true },
        { n: "Knee High Leather Boots", p: 8500, f: false },
        { n: "Combat Style Boots", p: 5500, f: false },
        { n: "Heeled Ankle Boots", p: 5800, f: false },
        { n: "Western Cowboy Boots", p: 6500, f: false },
        { n: "Sock Fit Boots", p: 4500, f: false },
        { n: "Chunky Platform Boots", p: 6200, f: false },
        { n: "Over The Knee Boots", p: 9500, f: false },
        { n: "Rain Ready Wellies", p: 2800, f: false },
        { n: "Snake Print Booties", p: 5200, f: false },
        { n: "White Mod Boots", p: 5900, f: false },
        { n: "Lace Up Hiker Boots", p: 6800, f: false },
        { n: "Premium Leather Riding Boots", p: 13500, f: true },
        { n: "Studded Biker Boots", p: 7200, f: false },
        { n: "Velvet Ankle Boots", p: 4800, f: false },
        { n: "Pointed Toe Stiletto Boots", p: 8200, f: false },
        { n: "Winter Fur Lined Boots", p: 5600, f: false },
        { n: "Cut Out Summer Boots", p: 3900, f: false },
        { n: "Patent Leather Booties", p: 6100, f: false },
    ];
    bootsData.forEach((d, i) =>
        allProducts.push(createProduct(i + 1, "boots", d.n, d.p, d.f))
    );

    return allProducts;
};

// ============================================
// MIGRATION LOGIC
// ============================================

async function migrate() {
    console.log("🚀 Starting product migration...\n");

    const products = generateProducts();
    console.log(`📦 Generated ${products.length} products to migrate.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
        const { images, ...productData } = product;

        // Insert product
        const { data: insertedProduct, error: productError } = await supabase
            .from("products")
            .insert(productData)
            .select("id")
            .single();

        if (productError) {
            console.error(`❌ Failed to insert "${product.name}":`, productError.message);
            errorCount++;
            continue;
        }

        // Insert images
        const imageInserts = images.map((url, index) => ({
            product_id: insertedProduct.id,
            url,
            sort_order: index,
        }));

        const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageInserts);

        if (imagesError) {
            console.error(`❌ Failed to insert images for "${product.name}":`, imagesError.message);
            errorCount++;
            continue;
        }

        successCount++;
        process.stdout.write(`\r✅ Migrated: ${successCount}/${products.length}`);
    }

    console.log("\n\n============================================");
    console.log(`✅ Successfully migrated: ${successCount} products`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount}`);
    }
    console.log("============================================");
    console.log("\n⚠️  IMPORTANT: Re-enable RLS in Supabase SQL Editor:");
    console.log("   ALTER TABLE products ENABLE ROW LEVEL SECURITY;");
    console.log("   ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;");
}

migrate().catch(console.error);
