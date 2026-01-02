
import { getAllOrders } from "@/lib/orders";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111111]">Orders</h1>
                    <p className="text-sm text-[#666666] mt-1">
                        Manage and track customer orders
                    </p>
                </div>
            </div>

            {/* Client Component for Filterable Table */}
            <OrdersTable orders={orders} />
        </div>
    );
}
