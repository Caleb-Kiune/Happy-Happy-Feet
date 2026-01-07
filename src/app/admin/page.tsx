import Link from "next/link";
import { Suspense } from "react";
import {
    Package,
    ShoppingCart,
    LayoutDashboard,
    ArrowUpRight,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { getDashboardStats } from "./actions";
import { StatsSkeleton } from "@/components/admin/StatsSkeleton";

// Independent async component for the stats grid
// This allows the rest of the page (header, links) to render immediately
async function DashboardStatsGrid() {
    const stats = await getDashboardStats();

    // Reusable card for consistency
    const StatCard = ({
        title,
        value,
        icon: Icon,
        colorClass,
        bgClass,
        badge,
        footer,
        hasError
    }: any) => (
        <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-50 relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div className={`${bgClass} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
                </div>
                {badge}
            </div>
            <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {title}
                </h3>
                {hasError ? (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-medium py-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Failed to load</span>
                    </div>
                ) : (
                    <p className="text-4xl font-sans font-bold text-gray-900">
                        {value}
                    </p>
                )}
                {footer}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Products Card */}
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                colorClass="text-[#E07A8A]"
                bgClass="bg-[#FDF2F4]"
                hasError={stats.error}
                badge={
                    <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                }
            />

            {/* Orders Card */}
            <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                icon={ShoppingCart}
                colorClass="text-blue-500"
                bgClass="bg-blue-50"
                hasError={stats.error}
                badge={
                    <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        WhatsApp
                    </span>
                }
                footer={
                    <p className="text-xs text-gray-400 mt-2 font-light">
                        Orders are processed via WhatsApp
                    </p>
                }
            />

            {/* Status Card (Static for now) */}
            <StatCard
                title="Store Status"
                value="Live & Active"
                icon={LayoutDashboard}
                colorClass="text-green-600"
                bgClass="bg-green-50"
                badge={
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                }
                footer={
                    <p className="text-xs text-gray-400 mt-2 font-light">
                        Open for business
                    </p>
                }
            />
        </div>
    );
}

export default async function AdminDashboardPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-sans text-3xl font-bold text-gray-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 font-light">
                        Welcome back! Here's what's happening in your store.
                    </p>
                </div>
                <div className="hidden md:block">
                    <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid with Suspense */}
            <Suspense fallback={<StatsSkeleton />}>
                <DashboardStatsGrid />
            </Suspense>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                    Quick Actions
                    <div className="h-px bg-gray-100 flex-1" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/products"
                        className="group flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#FDF2F4] transition-colors">
                                    <Package className="w-5 h-5 text-gray-400 group-hover:text-[#D16A7A] transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Manage Products</h3>
                                <p className="text-xs text-gray-500 mt-1 font-light">Add, edit, or remove inventory items.</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-4 h-4 text-[#D16A7A]" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="group flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                    <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">View Orders</h3>
                                <p className="text-xs text-gray-500 mt-1 font-light">Track and manage customer orders.</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
