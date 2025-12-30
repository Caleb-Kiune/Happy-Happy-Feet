"use client";

import { deleteProduct } from "@/app/admin/products/actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteProduct(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Product deleted");
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </Button>
    );
}
