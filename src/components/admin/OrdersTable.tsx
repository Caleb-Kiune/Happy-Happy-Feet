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
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, phone, or ID..."
                        className="pl-9 bg-white border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 text-gray-700 border-gray-200 w-full md:w-auto justify-between md:justify-start">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <span>{activeStatusLabel}</span>
                                </div>
                                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                    {statusFilter === 'all' ? orders.length : filteredOrders.length}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STATUS_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => setStatusFilter(option.value)}
                                    className="justify-between"
                                >
                                    {option.label}
                                    {statusFilter === option.value && <Check className="h-4 w-4 text-primary" />}
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
                            className="text-gray-500 hover:text-gray-900"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Showing Count */}
            <div className="text-sm text-gray-500 px-1">
                Showing <span className="font-medium text-gray-900">{filteredOrders.length}</span> order{filteredOrders.length !== 1 && 's'}
                {statusFilter !== 'all' && <span> in <span className="font-medium">{activeStatusLabel}</span></span>}
                {searchQuery && <span> matching "<span className="font-medium">{searchQuery}</span>"</span>}
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
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                            <Search className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p className="font-medium text-gray-900">No orders found</p>
                                        <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setStatusFilter("all");
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
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
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
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
