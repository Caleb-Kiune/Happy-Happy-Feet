"use client";

import { useState } from "react";
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
import { Menu, Instagram, Smartphone } from "lucide-react";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all h-16 sm:h-20 md:h-20 lg:h-20 xl:h-20">
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

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu" className="-mr-2 hover:bg-transparent text-gray-900">
                                    <Menu className="h-6 w-6" strokeWidth={1.5} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] border-l border-gray-200 bg-white p-0 flex flex-col h-full">
                                <SheetHeader className="p-6 border-b border-gray-100">
                                    <SheetTitle className="text-left">
                                        <div className="relative h-7 w-auto aspect-[3/1]">
                                            <Image
                                                src="/logo.png"
                                                alt="Happy Happy Feet"
                                                width={120}
                                                height={40}
                                                className="h-full w-auto object-contain"
                                                priority
                                                quality={100}
                                            />
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex-1 flex flex-col px-6 py-8">
                                    <nav className="flex flex-col gap-y-8">
                                        {NAV_LINKS.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-light uppercase tracking-[0.15em] text-gray-900 hover:text-gray-500 transition-colors border-b border-transparent hover:border-gray-100 pb-1 w-fit"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>

                                    <div className="mt-auto pt-8 border-t border-gray-50">
                                        <div className="flex gap-6 justify-start">
                                            <a
                                                href="https://instagram.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                <Instagram className="h-5 w-5" />
                                                <span className="sr-only">Instagram</span>
                                            </a>
                                            <a
                                                href="https://wa.me/254705774171"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                <Smartphone className="h-5 w-5" />
                                                <span className="sr-only">WhatsApp</span>
                                            </a>
                                        </div>
                                        <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest font-light">
                                            © 2024 Happy Happy Feet
                                        </p>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </Container>
        </header>
    );
}
