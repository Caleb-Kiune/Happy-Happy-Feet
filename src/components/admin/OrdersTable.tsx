"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { Eye, Search, Filter, Check, X } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type OrdersTableProps = {
    orders: Order[];
};

const STATUS_OPTIONS = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
];

export default function OrdersTable({ orders }: OrdersTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");

    // Sync state to URL with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchQuery) {
                params.set("search", searchQuery);
            } else {
                params.delete("search");
            }

            if (statusFilter && statusFilter !== "all") {
                params.set("status", statusFilter);
            } else {
                params.delete("status");
            }

            // Only update if the URL actually changes to avoid infinite loops
            const newQueryString = params.toString();
            const currentQueryString = searchParams.toString();

            if (newQueryString !== currentQueryString) {
                router.replace(`?${newQueryString}`, { scroll: false });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter, router, searchParams]);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Status Filter
            if (statusFilter !== "all" && order.status !== statusFilter) {
                return false;
            }

            // Search Filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesId = order.id.toLowerCase().includes(q);
                const matchesName = order.customer_name.toLowerCase().includes(q);
                const matchesPhone = order.phone.toLowerCase().includes(q);

                return matchesId || matchesName || matchesPhone;
            }

            return true;
        });
    }, [orders, searchQuery, statusFilter]);

    const activeStatusLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || "Status";

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all rounded-full h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 rounded-full border-transparent bg-gray-50 hover:bg-white hover:shadow-sm text-gray-600 w-full md:w-auto justify-between md:justify-start h-10 px-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        <span>{activeStatusLabel}</span>
                                    </div>
                                    <span className="ml-2 text-xs bg-white shadow-sm px-2 py-0.5 rounded-full text-gray-900 font-medium">
                                        {statusFilter === 'all' ? orders.length : filteredOrders.length}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-100">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {STATUS_OPTIONS.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setStatusFilter(option.value)}
                                        className="justify-between rounded-lg mx-1 my-0.5 cursor-pointer focus:bg-pink-50 focus:text-pink-900"
                                    >
                                        {option.label}
                                        {statusFilter === option.value && <Check className="h-4 w-4 text-[#E07A8A]" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {(searchQuery || statusFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all");
                                }}
                                className="text-gray-500 hover:text-red-500 h-10 rounded-full px-4"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
                <div className="hidden md:block text-sm text-gray-400 font-medium">
                    {filteredOrders.length} Orders
                </div>
            </div>

            {/* Desktop Table - Premium Style */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-white sticky top-0 z-10">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                            <TableHead className="w-[120px] pl-6 text-xs font-bold uppercase tracking-wider text-gray-400">Order ID</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Date</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-400">Total</TableHead>
                            <TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                                            <Search className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">No orders found</p>
                                            <p className="text-sm mt-1 text-gray-400">Try adjusting your filters.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                                    <TableCell className="font-mono text-xs text-gray-500 pl-6">
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
                                            <span className="text-xs text-gray-400">{order.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-[#111111] font-mono">
                                        {formatPrice(order.total)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#E07A8A]">
                                                <Eye className="w-4 h-4" />
                                                <span className="sr-only">View Order</span>
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards (Visible only on mobile) */}
            <div className="grid grid-cols-1 gap-4 md:hidden pb-24">
                {filteredOrders.map((order) => (
                    <Link href={`/admin/orders/${order.id}`} key={order.id} className="block group">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</span>
                                        <span className="text-xs text-gray-300">•</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString("en-KE", { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-[#111111] text-lg">{order.customer_name}</h3>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total</span>
                                    <span className="text-xl font-bold text-[#111111]">{formatPrice(order.total)}</span>
                                </div>
                                <div className="bg-gray-50 rounded-full p-2 text-gray-400 group-hover:bg-[#E07A8A] group-hover:text-white transition-colors">
                                    <Eye className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium">No orders found</h3>
                        <Button variant="link" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="text-[#E07A8A]">
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
