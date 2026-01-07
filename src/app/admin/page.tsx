"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Package, ShoppingCart, LayoutDashboard, ArrowUpRight, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminDashboardPage() {
    const { user, isLoading, isAuthorized, signOut } = useAdminAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/admin/login");
        }
    }, [isLoading, user, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-[#E07A8A] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Check authorization
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <EmptyState
                        title="Access Denied"
                        description={`Your email (${user.email}) is not authorized to access the admin dashboard.`}
                        icon={LogOut}
                        action={{
                            label: "Sign Out",
                            onClick: handleSignOut
                        }}
                    />
                </div>
            </div>
        );
    }

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
                    {/* Placeholder for date filter or action */}
                    <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Products Card */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-50 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="bg-[#FDF2F4] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Package className="w-6 h-6 text-[#E07A8A]" strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                            Total Products
                        </h3>
                        <p className="text-4xl font-sans font-bold text-gray-900">
                            100
                        </p>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-50 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="bg-blue-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <ShoppingCart className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            —
                        </span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                            Pending Orders
                        </h3>
                        <p className="text-4xl font-sans font-bold text-gray-900">
                            —
                        </p>
                        <p className="text-xs text-gray-400 mt-2 font-light">
                            Orders are processed via WhatsApp
                        </p>
                    </div>
                </div>

                {/* Status Card */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-50 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="bg-green-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <LayoutDashboard className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                            Store Status
                        </h3>
                        <p className="text-2xl font-sans font-bold text-green-600">
                            Live & Active
                        </p>
                        <p className="text-xs text-gray-400 mt-2 font-light">
                            Open used for business
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
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

            {/* Example Empty State (Hidden, but ready for logic if we had real empty data scenarios on dash) */}
            {/* <EmptyState 
                title="No Recent Activity" 
                description="When you start selling, your recent sales will appear here." 
                icon={LayoutDashboard} 
            /> */}
        </div>
    );
}
