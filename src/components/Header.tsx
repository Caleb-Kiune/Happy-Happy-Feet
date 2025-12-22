import Link from "next/link";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";

// Real WhatsApp link
const WHATSAPP_LINK = "https://wa.me/254736315506";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
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
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left font-sans text-xl font-bold tracking-tight text-gray-900">
                                        Happy <span className="text-accent-500">Happy</span> Feet
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-8 flex flex-col gap-y-6">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-lg font-medium text-gray-900 hover:text-accent-500 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <a
                                        href={WHATSAPP_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-x-2 text-lg font-medium text-success hover:opacity-80 transition-opacity"
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
