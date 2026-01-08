"use client";

import { motion, AnimatePresence } from "framer-motion";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { CONTACT_INFO } from "@/lib/constants";
import { useState } from "react";

const WHATSAPP_LINK = `https://wa.me/${CONTACT_INFO.whatsapp}`;

export default function FloatingWhatsApp() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <AnimatePresence>
            <motion.a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                aria-label="Chat with us on WhatsApp"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="fixed bottom-6 right-6 z-[100] flex items-center justify-end gap-3 group focus:outline-none"
            >
                {/* Desktop Tooltip */}
                <motion.div
                    initial={{ opacity: 0, x: 10, width: 0 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : 10,
                        width: isHovered ? "auto" : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:flex items-center bg-white px-3 py-1.5 rounded-lg shadow-md overflow-hidden whitespace-nowrap"
                >
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Chat</span>
                </motion.div>

                {/* Main Button */}
                <div
                    className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-[#25D366] rounded-full shadow-lg transition-colors duration-300 ring-offset-2 focus-within:ring-2 focus-within:ring-gray-400"
                >
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
            </motion.a>
        </AnimatePresence>
    );
}
