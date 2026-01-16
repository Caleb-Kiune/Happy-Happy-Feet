"use client";

import { deleteProduct } from "@/app/admin/products/actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { toast } from "sonner";

export default function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        setShowModal(false);
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
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(true)}
                disabled={isPending}
                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </Button>
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="Delete Product?"
                description="This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                isLoading={isPending}
            />
        </>
    );
}
