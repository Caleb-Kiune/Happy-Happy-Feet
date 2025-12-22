import Link from "next/link";
import Container from "@/components/Container";
import { Phone } from "lucide-react";

// Placeholder WhatsApp link
const WHATSAPP_LINK = "https://wa.me/254705774171";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
            <Container>
                <div className="flex flex-col items-center justify-center gap-y-6">
                    <div className="text-center">
                        <Link
                            href="/"
                            className="font-sans text-lg font-bold tracking-tight text-gray-900"
                        >
                            Happy <span className="text-accent-500">Happy</span> Feet
                        </Link>
                    </div>

                    <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-success transition-colors"
                    >
                        <Phone className="h-4 w-4" />
                        Order via WhatsApp
                    </a>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Copyright © 2025 Happy Happy Feet • All rights reserved
                    </p>
                </div>
            </Container>
        </footer>
    );
}
