import { getCategories } from "./actions";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#111111]">Categories</h1>
                <p className="text-sm text-[#666666] mt-1">Manage product categories</p>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    );
}
