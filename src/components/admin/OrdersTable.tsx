"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/orders";
import { formatPrice, cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { Eye, Search, Filter, Check, X, Trash2 } from "lucide-react";
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
import { deleteOrders } from "@/app/admin/orders/actions";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { toast } from "sonner";

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

    // Selection & Deletion State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, startTransition] = useTransition();

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

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredOrders.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleBulkDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        startTransition(async () => {
            const result = await deleteOrders(Array.from(selectedIds));
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`${selectedIds.size} orders deleted successfully`);
                setSelectedIds(new Set());
            }
        });
    };

    const activeStatusLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || "Status";
    const isAllSelected = filteredOrders.length > 0 && selectedIds.size === filteredOrders.length;

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10 bg-white shadow-sm border-gray-200 focus:border-pink-200 focus:ring-2 focus:ring-pink-100 transition-all rounded-lg h-11 md:h-10 text-base md:text-sm"
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
                                <Button variant="outline" className="gap-2 rounded-lg border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-gray-700 w-full md:w-auto justify-between md:justify-start h-11 md:h-10 px-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        <span>{activeStatusLabel}</span>
                                    </div>
                                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-900 font-medium">
                                        {statusFilter === 'all' ? orders.length : filteredOrders.length}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-100 bg-white">
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

            {/* Bulk Action Floating Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-[calc(18rem+2rem)] md:right-8 flex justify-center z-[60] mb-[env(safe-area-inset-bottom)] pointer-events-none animate-in slide-in-from-bottom-5 fade-in">
                    <div className="bg-[#111111] text-white rounded-full shadow-xl px-6 py-3 flex items-center gap-6 pointer-events-auto">
                        <span className="text-sm font-medium pl-2">
                            {selectedIds.size} selected
                        </span>
                        <div className="h-4 w-px bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:text-white h-8 hover:bg-white/10 rounded-full px-3"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#E07A8A] hover:bg-[#D16A7A] text-white h-8 rounded-full px-4 shadow-sm"
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Table - Premium Style */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-white sticky top-0 z-10">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                            <TableHead className="w-[50px] pl-6">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#111111] focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[120px] text-xs font-bold uppercase tracking-wider text-gray-400">Order ID</TableHead>
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
                                <TableCell colSpan={7} className="h-64 text-center">
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
                                <TableRow
                                    key={order.id}
                                    className={cn(
                                        "hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer",
                                        selectedIds.has(order.id) ? "bg-pink-50/10" : ""
                                    )}
                                    onClick={() => toggleSelect(order.id)}
                                >
                                    <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#111111] focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                                            checked={selectedIds.has(order.id)}
                                            onChange={() => toggleSelect(order.id)}
                                        />
                                    </TableCell>
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
                                            <span className="text-xs text-gray-400">{order.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-[#111111] font-mono">
                                        {formatPrice(order.total)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
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
                    <div
                        key={order.id}
                        className={cn(
                            "block group relative overflow-hidden bg-white rounded-2xl transition-all duration-200",
                            selectedIds.has(order.id)
                                ? "ring-2 ring-[#E07A8A] shadow-md bg-pink-50/10"
                                : "shadow-sm border border-gray-100"
                        )}
                        onClick={() => toggleSelect(order.id)}
                    >
                        {/* Checkbox Overlay - FIX: Always visible, larger */}
                        <div className="absolute top-3 left-3 z-20 p-2 -m-2">
                            <input
                                type="checkbox"
                                className={cn(
                                    "rounded-full border-gray-300 bg-white text-[#E07A8A] focus:ring-0 h-6 w-6 transition-all shadow-sm cursor-pointer",
                                    selectedIds.has(order.id) ? "opacity-100" : "opacity-100" // Always visible
                                )}
                                checked={selectedIds.has(order.id)}
                                onChange={() => toggleSelect(order.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4 pl-8"> {/* Added pl-8 for checkbox space */}
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
                                <Link href={`/admin/orders/${order.id}`} onClick={(e) => e.stopPropagation()}>
                                    <div className="bg-gray-50 rounded-full p-2 text-gray-400 hover:bg-[#E07A8A] hover:text-white transition-colors">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
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


            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={`Delete ${selectedIds.size} Orders?`}
                description="This action cannot be undone. These orders will be permanently removed."
                confirmText="Delete Orders"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div >
    );
}
