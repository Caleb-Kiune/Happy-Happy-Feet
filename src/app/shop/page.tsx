import { Suspense } from "react";
import { getAllProducts } from "@/lib/products";
import ShopContent from "@/components/ShopContent";

export const metadata = {
    title: "Shop | Happy Happy Feet",
    description: "Browse our complete collection of comfortable and stylish women's shoes.",
};

// Disable static generation - always fetch fresh data
export const dynamic = "force-dynamic";

export default async function ShopPage() {
    const products = await getAllProducts();

    return (
        <Suspense fallback={<div className="h-screen bg-white" />}>
            <ShopContent products={products} />
        </Suspense>
    );
}
