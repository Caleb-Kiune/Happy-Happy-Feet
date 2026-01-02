
import { createOrder } from "@/app/checkout/actions";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load env vars
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrderCreation() {
    console.log("Fetching a valid product...");
    const { data: products } = await supabase.from("products").select("id, name, price").limit(1);

    if (!products || products.length === 0) {
        console.error("No products found to test with.");
        return;
    }

    const product = products[0];
    console.log(`Using product: ${product.name} (${product.id})`);

    // Simulate Checkout Data with CORRECT UUID usage
    const orderData = {
        customer: {
            name: "Test User Fixed UUID",
            phone: "+254700000000",
            location: "Test Location, Nairobi",
            notes: "Automated test order with valid UUID"
        },
        items: [{
            product_id: product.id, // This is what the fixed CheckoutPage will now send
            product_name: product.name,
            size: "40",
            quantity: 1,
            price: product.price
        }],
        total: product.price
    };

    console.log("Calling createOrder server action with VALID UUID...");

    try {
        const result = await createOrder(orderData);
        if (result.success) {
            console.log(`SUCCESS! Order created with ID: ${result.orderId}`);
        } else {
            console.error("FAILED:", result.error);
        }
    } catch (e) {
        console.error("Exception invoking action:", e);
    }
}

testOrderCreation();
