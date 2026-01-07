"use client";

import { useTransition } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OrderStatus } from "@/lib/orders";
import { ActionState } from "@/app/admin/orders/actions";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: OrderStatus;
    updateAction: (orderId: string, status: string) => Promise<ActionState>;
}

const STATUSES: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function OrderStatusSelect({
    orderId,
    currentStatus,
    updateAction,
}: OrderStatusSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (value: string) => {
        if (value === currentStatus) return;

        startTransition(async () => {
            const result = await updateAction(orderId, value);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Order status updated to ${value}`);
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-[180px] bg-white shadow-sm border-gray-200">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 shadow-lg">
                    {STATUSES.map((status) => (
                        <SelectItem
                            key={status.value}
                            value={status.value}
                            className="cursor-pointer focus:bg-pink-50 focus:text-pink-900"
                        >
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
