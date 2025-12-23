"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Phone, ShoppingBag } from "lucide-react";

// Real WhatsApp link
const WHATSAPP_LINK = "https://wa.me/254705774171";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="font-sans text-xl font-bold tracking-tight text-gray-900"
                        >
                            Happy <span className="text-accent-500">Happy</span> Feet
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-x-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-900 hover:text-accent-500 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Cart Button (Desktop) */}
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-6 w-6" />
                            {totalItems > 0 && (
                                <Badge variant="secondary" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                                    {totalItems}
                                </Badge>
                            )}
                        </Button>

                        {/* WhatsApp Button (Desktop) */}
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-success p-2 text-white hover:bg-opacity-90 transition-opacity"
                            aria-label="Contact on WhatsApp"
                        >
                            <Phone className="h-4 w-4 fill-current" />
                        </a>
                    </nav>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu">
                                    <Menu className="h-6 w-6 text-gray-900" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] border-l border-gray-200 bg-white p-8">
                                <SheetHeader>
                                    <SheetTitle className="text-left font-sans text-xl font-bold tracking-tight text-gray-900">
                                        Happy <span className="text-accent-500">Happy</span> Feet
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-12 flex flex-col gap-y-8">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-xl font-medium text-gray-900 hover:text-accent-500 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    {/* Cart Button (Mobile) */}
                                    <div className="flex items-center justify-start">
                                        <Button variant="ghost" size="icon" className="relative ml-0 pl-0 hover:bg-transparent">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <ShoppingBag className="h-6 w-6" />
                                                    {totalItems > 0 && (
                                                        <Badge variant="secondary" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                                                            {totalItems}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xl font-medium text-gray-900">Cart</span>
                                            </div>
                                        </Button>
                                    </div>


                                    <a
                                        href={WHATSAPP_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 flex w-full items-center justify-center gap-x-3 rounded-full bg-success py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-opacity-90 active:scale-95 hover:shadow-md"
                                    >
                                        <Phone className="h-5 w-5 fill-current" />
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </Container>
        </header>
    );
}

