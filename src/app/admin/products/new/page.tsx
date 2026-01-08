import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/products/actions";
import { getCategories } from "@/app/admin/categories/actions";

export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#111111]">Add New Product</h1>
                <p className="text-sm text-[#666666] mt-1">Create a new item in your store</p>
            </div>

            <ProductForm action={createProduct} availableCategories={categories} />
        </div>
    );
}
