"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Package, ShoppingCart, LayoutDashboard } from "lucide-react";

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
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-[#111111] mb-2">
                        Access Denied
                    </h1>
                    <p className="text-sm text-[#666666] mb-6">
                        Your email ({user.email}) is not authorized to access the admin
                        dashboard.
                    </p>
                    <button
                        onClick={handleSignOut}
                        className="text-sm text-[#E07A8A] hover:text-[#D66A7A] font-medium"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header - Mobile Only (Desktop has Sidebar) */}
            <header className="bg-white border-b border-[#E5E5E5] md:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold text-[#111111]">
                                Happy Happy Feet
                            </h1>
                            <span className="text-xs font-medium text-[#999999] bg-[#F5F5F5] px-2 py-1 rounded-full">
                                Admin
                            </span>
                        </div>
                        {/* Mobile Logout is in Bottom Bar, checking if we need this div */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#666666]">{user.email}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#111111]">Dashboard</h2>
                    <p className="text-sm text-[#666666] mt-1">
                        Welcome back! Manage your store from here.
                    </p>
                </div>

                {/* Quick Stats - Placeholder */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#E07A8A]/10 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-[#E07A8A]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Total Products</p>
                                <p className="text-2xl font-semibold text-[#111111]">100</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Pending Orders</p>
                                <p className="text-2xl font-semibold text-[#111111]">—</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Store Status</p>
                                <p className="text-lg font-semibold text-green-600">Live</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h3 className="text-lg font-medium text-[#111111] mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/admin/products"
                        className="group bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:border-[#E07A8A] transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-[#111111] group-hover:text-[#E07A8A] transition-colors">
                                    Manage Products
                                </h4>
                                <p className="text-sm text-[#666666] mt-1">
                                    Add, edit, or remove products
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-[#999999] group-hover:text-[#E07A8A] transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="group bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:border-[#E07A8A] transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-[#111111] group-hover:text-[#E07A8A] transition-colors">
                                    View Orders
                                </h4>
                                <p className="text-sm text-[#666666] mt-1">
                                    Track and manage customer orders
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-[#999999] group-hover:text-[#E07A8A] transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
