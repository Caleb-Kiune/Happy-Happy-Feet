
import { getOrderById } from "@/lib/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { updateOrderStatus } from "@/app/admin/orders/actions";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
    params: {
        id: string;
    };
}

// In Next.js 15+ params are async
// But in Next 13/14 they are props.
// Assuming typical recent Next.js usage where params is just a prop, awaiting if needed.
// Based on file structure this looks like App Router.

export default async function OrderDetailPage({ params }: any) {
    const { id } = await params; // Future proofing for Next.js 15
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-[#111111]">
                                Order #{order.id.slice(0, 8)}
                            </h1>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-[#666666] mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleString("en-KE", {
                                dateStyle: "long",
                                timeStyle: "short"
                            })}
                        </p>
                    </div>
                </div>

                {/* Status Update (Client Component Wrapper for Interactivity) */}
                <div className="w-full md:w-auto">
                    <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        updateAction={updateOrderStatus}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#E5E5E5]">
                            <h2 className="font-semibold text-[#111111]">Order Items</h2>
                        </div>
                        <Table>
                            <TableHeader className="bg-[#FAFAFA]">
                                <TableRow>
                                    <TableHead className="w-[80px]">Product</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                {item.product_image && (
                                                    <Image
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        fill
                                                        className="object-cover"
                                                        placeholder="blur"
                                                        blurDataURL={PLACEHOLDER_IMAGE}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-[#111111]">{item.product_name}</p>
                                                <p className="text-xs text-[#666666]">Size: {item.size}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatPrice(item.price_at_purchase)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatPrice(item.price_at_purchase * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="bg-[#FAFAFA] p-6 border-t border-[#E5E5E5]">
                            <div className="flex justify-between items-center text-lg font-semibold text-[#111111]">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm p-6">
                        <h2 className="font-semibold text-[#111111] mb-4">Customer Details</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#999999] uppercase font-medium">Name</p>
                                    <p className="text-sm font-medium text-[#111111]">{order.customer_name}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#999999] uppercase font-medium">Phone</p>
                                    <p className="text-sm font-medium text-[#111111]">{order.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#999999] uppercase font-medium">Location</p>
                                    <p className="text-sm font-medium text-[#111111]">{order.location}</p>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <p className="text-xs text-[#999999] uppercase font-medium mb-1">Notes</p>
                                    <p className="text-sm text-[#666666] italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        "{order.notes}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
