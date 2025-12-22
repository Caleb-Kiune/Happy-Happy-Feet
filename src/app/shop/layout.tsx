import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop Women's Shoes – Heels, Sandals, Sneakers & More",
    description: "Explore our latest styles, designed for every occasion. From elegant heels to everyday flats.",
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
