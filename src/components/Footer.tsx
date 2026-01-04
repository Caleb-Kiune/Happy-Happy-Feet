import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Instagram, Smartphone, Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = {
    // shop category removed per request
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
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 md:pt-24 md:pb-12">
            <Container>
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="border-b border-gray-100 pb-6 md:border-0 md:pb-0">
                            <Link href="/" className="block relative h-40 sm:h-48 md:h-64 w-64 max-w-full">
                                <Image
                                    src="/logo.svg"
                                    alt="Happy Happy Feet"
                                    fill
                                    className="object-contain object-left"
                                />
                            </Link>
                        </div>
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
                    <div className="md:col-span-3 md:col-start-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 md:mb-8">
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

                    <div className="md:col-span-3 md:col-start-10">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 md:mb-8">
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
                <div className="border-t border-gray-200 pt-8 mt-12 md:mt-0 flex flex-col md:flex-row justify-between items-center gap-4">
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
