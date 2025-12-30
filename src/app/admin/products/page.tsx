import { getAllProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductManagement from "@/components/admin/ProductManagement";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const products = await getAllProducts();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111111]">Products</h1>
                    <p className="text-sm text-[#666666] mt-1">
                        Manage your inventory
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/products/new">
                        <Button className="rounded-full bg-[#E07A8A] hover:bg-[#D66A7A] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <ProductManagement initialProducts={products} />
        </div>
    );
}
