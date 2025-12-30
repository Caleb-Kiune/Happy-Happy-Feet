"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    LogOut,
    Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminNav() {
    const pathname = usePathname();
    const { signOut, user } = useAdminAuth();

    // 1. Hide on Login Page
    if (pathname === "/admin/login") {
        return null;
    }

    const navItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: "Products",
            href: "/admin/products",
            icon: Package,
            exact: false,
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: ShoppingBag,
            exact: false,
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Layout - Sidebar (md:block hidden) */}
            <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-[#E5E5E5] z-50">
                {/* Brand */}
                <div className="h-16 flex items-center px-6 border-b border-[#E5E5E5]">
                    <div className="flex flex-col">
                        <span className="font-semibold text-[#111111]">
                            Happy Happy Feet
                        </span>
                        <span className="text-xs font-medium text-[#999999] bg-[#F5F5F5] px-2 py-0.5 rounded-full w-fit mt-1">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive(item.href, item.exact)
                                    ? "bg-[#FDF2F4] text-[#D16A7A]"
                                    : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Footer / User Info */}
                <div className="p-4 border-t border-[#E5E5E5]">
                    <div className="mb-4 px-2">
                        <p className="text-xs text-[#999999] font-medium uppercase tracking-wider mb-1">
                            Signed in as
                        </p>
                        <p className="text-sm font-medium text-[#111111] truncate">
                            {user?.email}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => signOut()}
                        className="w-full justify-start text-[#666666] hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Button>
                </div>
            </aside>

            {/* Mobile Layout - Bottom Bar (md:hidden block) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] z-50 pb-[env(safe-area-inset-bottom)]">
                <nav className="grid grid-cols-4 h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1",
                                isActive(item.href, item.exact)
                                    ? "text-[#D16A7A]"
                                    : "text-[#999999] hover:text-[#111111]"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive(item.href, item.exact) ? "fill-current/20" : "")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    ))}

                    {/* Mobile Logout */}
                    <button
                        onClick={() => signOut()}
                        className="flex flex-col items-center justify-center gap-1 text-[#999999] hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Log Out</span>
                    </button>
                </nav>
            </div>
        </>
    );
}
