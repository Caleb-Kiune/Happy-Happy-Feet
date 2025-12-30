import { getAllProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { deleteProduct } from "./actions"; // We'll need a client component for the delete button wrapper if creating a server act
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

// We will use a Search Filter (Client Component) separate or inline. 
// For simplicity in this step, we just list them all.

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
                        Manage your inventory ({products.length} items)
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Simple Search Stub - fully functional would be a client component */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search..." className="pl-9 w-[200px] bg-white" />
                    </div>

                    <Link href="/admin/products/new">
                        <Button className="rounded-full bg-[#E07A8A] hover:bg-[#D66A7A] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#FAFAFA]">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Namge</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Sizes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        {product.images[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-[#111111]">{product.name}</TableCell>
                                <TableCell className="capitalize text-gray-600">{product.category}</TableCell>
                                <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        {product.sizes.length} sizes
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {product.featured && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FDF2F4] text-[#D16A7A]">
                                            Featured
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#111111]">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                    No products found. Click "Add Product" to start.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map((product) => (
                    <div key={product.id} className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex gap-4 shadow-sm">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            {product.images[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-[#111111] truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                                </div>
                                {product.featured && (
                                    <span className="flex-shrink-0 inline-block h-2 w-2 rounded-full bg-[#E07A8A]" />
                                )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-semibold text-[#111111]">KSh {product.price.toLocaleString()}</span>
                                <div className="flex gap-1">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
