"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import CartSheet from "@/components/CartSheet";
import SearchToggle from "@/components/SearchToggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Instagram, Smartphone } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollDirection, isAtTop } = useScrollDirection();

    // Logic for header state
    const isHeaderHidden = !isAtTop && scrollDirection === 'down';
    const isHeaderTransparent = isAtTop;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out h-20 sm:h-24 md:h-32 ${isHeaderHidden
                ? '-translate-y-full opacity-0'
                : 'translate-y-0 opacity-100'
                } ${isHeaderTransparent
                    ? 'bg-transparent border-transparent'
                    : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
                }`}
        >
            <Container className="h-full">
                {/* 
                   Preserving User's Preferred Alignment: items-center 
                   Preserving Massive Height: h-full of parent
                */}
                <div className="flex h-full items-center justify-between transition-colors duration-500">

                    {/* Logo - Left Aligned */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="block group">
                            <div className="relative h-20 sm:h-24 md:h-32 w-auto flex items-center">
                                <Image
                                    src="/logo.svg"
                                    alt="Happy Happy Feet"
                                    width={500}
                                    height={500}
                                    className="
                                            h-full w-auto object-contain
                                            scale-[1.6] sm:scale-[1.2] md:scale-[1.25]
                                            translate-y-[6px] sm:translate-y-0
                                            origin-left
                                            transition-all duration-500
                                            group-hover:opacity-90
                                            "

                                    priority
                                    quality={100}
                                />
                            </div>
                        </Link>
                    </div>


                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-x-8">
                        <Link
                            href="/shop"
                            className={`text-sm font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${isHeaderTransparent ? 'text-white hover:text-white/80' : 'text-gray-900 hover:opacity-70'
                                }`}
                        >
                            Shop
                        </Link>

                        {/* Global Search */}
                        <div className={`flex items-center transition-colors duration-300 ${isHeaderTransparent ? 'text-white' : 'text-gray-900'
                            }`}>
                            <SearchToggle />
                        </div>

                        {/* Cart Button */}
                        <div className={`transition-colors duration-300 ${isHeaderTransparent ? 'text-white' : 'text-gray-900'
                            }`}>
                            <CartSheet />
                        </div>
                    </nav>

                    {/* Mobile Menu Trigger & Cart */}
                    <div className={`flex items-center md:hidden gap-4 transition-colors duration-300 ${isHeaderTransparent ? 'text-white' : 'text-gray-900'
                        }`}>
                        <SearchToggle mobile />

                        <CartSheet />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu" className="-mr-2 hover:bg-transparent text-gray-900 md:text-current transition-colors">
                                    <Menu className="h-6 w-6" strokeWidth={1.5} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] border-l border-gray-200 bg-white p-0 flex flex-col h-full z-[60]">
                                <SheetHeader className="p-6 border-b border-gray-100">
                                    <SheetTitle className="text-left">
                                        <div className="relative h-16 w-auto">
                                            <Image
                                                src="/logo.svg"
                                                alt="Happy Happy Feet"
                                                width={500}
                                                height={500}
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
                                                className="text-lg font-light uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors border-b border-transparent hover:border-gray-100 pb-1 w-fit"
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
