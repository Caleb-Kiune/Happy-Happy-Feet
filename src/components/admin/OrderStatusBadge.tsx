
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/orders";

const STATUS_Styles: Record<OrderStatus, string> = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    confirmed: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10",
    shipped: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10",
    delivered: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
};

export default function OrderStatusBadge({ status, className }: { status: OrderStatus | string, className?: string }) {
    const normalizedStatus = status.toLowerCase() as OrderStatus;
    const style = STATUS_Styles[normalizedStatus] || "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-500/10";

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                style,
                className
            )}
        >
            {normalizedStatus}
        </span>
    );
}
