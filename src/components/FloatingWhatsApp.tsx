"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const WHATSAPP_LINK = `https://wa.me/${CONTACT_INFO.whatsapp}`;

export default function FloatingWhatsApp() {
    return (
        <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/90 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-black">
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:mr-2 opacity-0 group-hover:opacity-100 absolute right-14">
                Chat with us
            </span>
        </a>
    );
}
