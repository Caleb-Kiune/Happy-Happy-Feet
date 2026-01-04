import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Instagram, Smartphone, Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = {
    shop: [
        { name: "New Arrivals", href: "/shop" },
        { name: "Best Sellers", href: "/shop" },
        { name: "All Shoes", href: "/shop" },
    ],
    support: [
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping & Returns", href: "/about" }, // Placeholder, can be separate page
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/about" },
    ],
    social: [
        { name: "Instagram", href: "https://instagram.com", icon: Instagram },
        { name: "WhatsApp", href: "https://wa.me/254705774171", icon: Smartphone },
        { name: "Email", href: "mailto:hello@happyhappyfeet.com", icon: Mail },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 md:pt-24 md:pb-12">
            <Container>
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="block relative h-8 w-40">
                            <Image
                                src="/logo.png"
                                alt="Happy Happy Feet"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                        <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                            Step into comfort and style. Premium footwear designed for the modern lifestyle.
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            {FOOTER_LINKS.social.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-900 transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon strokeWidth={1.5} className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 md:mb-8">
                            Shop
                        </h3>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 md:mb-8">
                            Support
                        </h3>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 md:mb-8">
                            Visit Us
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600 font-light leading-relaxed">
                            <p>
                                Nairobi, Kenya<br />
                                Delivery Countrywide
                            </p>
                            <a
                                href="https://wa.me/254705774171"
                                className="block hover:text-gray-900 transition-colors"
                            >
                                +254 705 774 171
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-50 pt-8 mt-12 md:mt-0 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-light">
                        © 2025 Happy Happy Feet. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-light">
                            Designed with Care
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
