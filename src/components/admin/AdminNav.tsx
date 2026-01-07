"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
            {/* Desktop Layout - Premium Sidebar */}
            <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-72 bg-white z-50">
                {/* Brand - Clean & Airy */}
                <div className="h-24 flex items-center px-8">
                    <div className="flex flex-col gap-1.5">
                        <Link href="/" className="relative h-6 w-auto aspect-[4/1] block hover:opacity-70 transition-opacity">
                            {/* Replaced Image with Text for crispness if image has issues, but keeping Image as requested. 
                                 Using a slightly larger container. */}
                            <Image
                                src="/logo.png"
                                alt="Happy Happy Feet"
                                width={120}
                                height={40}
                                className="h-full w-auto object-contain object-left"
                                priority
                                quality={100}
                            />
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-0.5">
                            Store Admin
                        </span>
                    </div>
                </div>

                {/* Nav Items - Pill Style */}
                <nav className="flex-1 px-6 space-y-2 py-4">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-full text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    active
                                        ? "bg-[#FDF2F4] text-[#D16A7A] shadow-sm ring-1 ring-[#E07A8A]/10"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                        active ? "text-[#D16A7A]" : "text-gray-400 group-hover:text-gray-900"
                                    )}
                                    strokeWidth={active ? 2 : 1.5}
                                />
                                <span className={cn("tracking-wide", active ? "font-semibold" : "")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Minimalist Profile */}
                <div className="p-8">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm text-xs font-bold text-gray-900">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                    Admin
                                </p>
                                <p className="text-[10px] text-gray-500 truncate max-w-[100px]">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => signOut()}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-transparent rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Layout - Premium Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
                <nav className="grid grid-cols-4 h-auto px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all",
                                    active ? "text-[#D16A7A]" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-full transition-all",
                                    active ? "bg-[#FDF2F4] shadow-sm" : "bg-transparent"
                                )}>
                                    <item.icon
                                        className={cn("w-5 h-5", active ? "stroke-2" : "stroke-1.5")}
                                    />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium tracking-wide",
                                    active ? "text-[#D16A7A]" : "text-gray-400"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Mobile Logout */}
                    <button
                        onClick={() => signOut()}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <div className="p-1.5 bg-transparent rounded-full">
                            <LogOut className="w-5 h-5 stroke-1.5" />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">
                            Log Out
                        </span>
                    </button>
                </nav>
            </div>
        </>
    );
}
