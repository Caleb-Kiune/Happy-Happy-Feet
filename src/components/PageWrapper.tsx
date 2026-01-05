"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string; // Allow passing extra classes if needed
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div
            className={cn(
                "transition-all duration-300 ease-in-out w-full",
                !isHomePage ? "pt-24 sm:pt-28 md:pt-32" : "pt-0", // Add padding only on non-home pages
                className
            )}
        >
            {children}
        </div>
    );
}
