
import { getAllOrders } from "@/lib/orders";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

            {/* Filters Bar (Simulated UI for now - can be made functional with client componentWrapper) */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-9 bg-white border-gray-200"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 text-gray-600">
                        <Filter className="w-4 h-4" />
                        Status
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#FAFAFA]">
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString("en-KE", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#111111]">{order.customer_name}</span>
                                            <span className="text-xs text-gray-500">{order.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-[#111111]">
                                        {formatPrice(order.total)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </Button>
                                        </Link>
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
