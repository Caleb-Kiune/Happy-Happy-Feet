"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ShopSearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isShopPage: boolean;
    isLiveSearchEnabled: boolean;
    setLiveSearchEnabled: (enabled: boolean) => void;
}

const ShopSearchContext = createContext<ShopSearchContextType | undefined>(undefined);

export function ShopSearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLiveSearchEnabled, setLiveSearchEnabled] = useState(true);
    const pathname = usePathname();
    const isShopPage = pathname === "/shop";

    // Clear search query when leaving shop page
    useEffect(() => {
        if (!isShopPage) {
            setSearchQuery("");
        }
    }, [isShopPage]);

    return (
        <ShopSearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            isShopPage,
            isLiveSearchEnabled,
            setLiveSearchEnabled
        }}>
            {children}
        </ShopSearchContext.Provider>
    );
}

export function useShopSearch() {
    const context = useContext(ShopSearchContext);
    if (context === undefined) {
        throw new Error("useShopSearch must be used within a ShopSearchProvider");
    }
    return context;
}
