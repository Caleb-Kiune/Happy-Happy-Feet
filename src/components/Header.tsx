"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import CartSheet from "@/components/CartSheet";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";

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
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all h-16 sm:h-20 md:h-20 lg:h-20 xl:h-20"> {/* Maintaining responsiveness but aiming for slim look */}
            <Container className="h-full">
                <div className="flex h-full items-center justify-between">
                    {/* Logo - Left Aligned */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="block">
                            <div className="relative h-8 md:h-10 w-auto aspect-[3/1]">
                                <Image
                                    src="/logo.png"
                                    alt="Happy Happy Feet"
                                    width={140}
                                    height={46}
                                    className="h-full w-auto object-contain"
                                    priority
                                    quality={100}
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Minimalist (Just Shop) */}
                    <nav className="hidden md:flex items-center gap-x-12">
                        <Link
                            href="/shop"
                            className="text-sm font-medium tracking-[0.2em] uppercase text-gray-900 hover:opacity-70 transition-opacity"
                        >
                            Shop
                        </Link>

                        {/* Cart Button (Desktop) */}
                        <CartSheet />
                    </nav>

                    {/* Mobile Menu Trigger & Cart */}
                    <div className="flex items-center md:hidden gap-4">
                        <CartSheet />

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu" className="-mr-2">
                                    <Menu className="h-6 w-6 text-gray-900" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] border-l border-gray-200 bg-white p-8">
                                <SheetHeader>
                                    <SheetTitle className="text-left font-sans text-xl font-bold tracking-tight text-gray-900">
                                        <div className="relative h-8 w-auto aspect-[3/1]">
                                            <Image
                                                src="/logo.png"
                                                alt="Happy Happy Feet"
                                                width={140}
                                                height={46}
                                                className="h-full w-auto object-contain"
                                                priority
                                                quality={100}
                                            />
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-12 flex flex-col gap-y-6">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-sm font-medium uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </Container>
        </header>
    );
}
