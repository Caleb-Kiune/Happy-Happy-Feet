"use client";

import { useState, useTransition } from "react";
import { Category, createCategory, updateCategory, deleteCategory } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories] = useState<Category[]>(initialCategories); // Optimistic updates handling in complex real apps, but here we rely on server revalidation
    const [isPending, startTransition] = useTransition();

    // Add State
    const [newCategory, setNewCategory] = useState("");

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const handleCreate = async () => {
        if (!newCategory.trim()) return;

        const formData = new FormData();
        formData.append("name", newCategory);

        startTransition(async () => {
            const res = await createCategory(formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Category added");
                setNewCategory("");
            }
        });
    };

    const handleUpdate = async (id: string, oldName: string) => {
        if (!editName.trim() || editName === oldName) {
            setEditingId(null);
            return;
        }

        const formData = new FormData();
        formData.append("name", editName);

        startTransition(async () => {
            const res = await updateCategory(id, oldName, formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Category updated");
                if (res.warning) toast.warning(res.warning);
                setEditingId(null);
            }
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"?`)) return;

        startTransition(async () => {
            const res = await deleteCategory(id, name);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Category deleted");
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* Add New Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="grid gap-2 w-full max-w-sm">
                    <label className="text-sm font-medium text-gray-700">New Category Name</label>
                    <Input
                        placeholder="e.g. Boots"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    disabled={isPending || !newCategory.trim()}
                    className="bg-gray-900 text-white"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Category
                </Button>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialCategories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">
                                        {editingId === cat.id ? (
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="h-8 w-full max-w-[200px]"
                                            />
                                        ) : (
                                            <span className="capitalize">{cat.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-mono text-xs">
                                        {cat.slug}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === cat.id ? (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleUpdate(cat.id, cat.name)}
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-gray-400 hover:text-[#E07A8A]"
                                                        onClick={() => {
                                                            setEditingId(cat.id);
                                                            setEditName(cat.name);
                                                        }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
