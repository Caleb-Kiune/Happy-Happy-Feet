
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/orders";

const STATUS_Styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderStatusBadge({ status, className }: { status: OrderStatus | string, className?: string }) {
    const normalizedStatus = status.toLowerCase() as OrderStatus;
    const style = STATUS_Styles[normalizedStatus] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                style,
                className
            )}
        >
            {normalizedStatus}
        </span>
    );
}
