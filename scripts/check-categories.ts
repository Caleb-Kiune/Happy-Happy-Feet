import { createStaticClient } from "../src/lib/supabase-static";

async function checkCategories() {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error("Error fetching categories:", error);
        return;
    }

    const counts: Record<string, number> = {};
    data.forEach((p: { category: string }) => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });

    console.log("Category Distribution:");
    console.table(counts);
}

checkCategories();
