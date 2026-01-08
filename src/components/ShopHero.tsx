"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import heroImage from "@/assets/images/lexie-barnhorn-7HzqlpXhQWI-unsplash.jpg";

type ShopHeroProps = {
    title?: string;
    subtitle?: string;
};

export default function ShopHero({
    title = "The Collection",
    subtitle = "Timeless comfort, elevated style"
}: ShopHeroProps) {
    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden mb-8 md:mb-12">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Woman wearing stylish high heels"
                    fill
                    className="object-cover object-[position:30%_70%]"
                    priority
                    placeholder="blur"
                />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30" />
            </div>

            {/* Content */}
            <motion.div
                key={title} // Re-animate on title change
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center text-white px-4 pt-16"
            >
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider uppercase drop-shadow-md">
                    {title}
                </h1>
                <div className="h-px w-24 bg-white/80 mx-auto my-6 shadow-sm"></div>
                <p className="font-sans text-lg md:text-xl font-light tracking-widest opacity-90 max-w-xl mx-auto uppercase">
                    {subtitle}
                </p>
            </motion.div>
        </div>
    );
}
