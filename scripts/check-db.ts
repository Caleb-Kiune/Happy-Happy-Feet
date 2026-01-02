
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
    console.log("Checking orders table...");

    const { data: orders, error } = await supabase
        .from("orders")
        .select("id, created_at, customer_name, status")
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching orders:", error);
    } else {
        console.log("Most recent orders:");
        orders?.forEach(o => {
            console.log(`- [${o.created_at}] ${o.customer_name} (ID: ${o.id})`);
        });
    }
}

checkOrders();
