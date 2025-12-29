import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: "Admin | Happy Happy Feet",
    description: "Admin dashboard for Happy Happy Feet",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} font-sans antialiased bg-[#FAFAFA] text-[#111111] min-h-screen`}
            >
                <AdminAuthProvider>
                    {children}
                    <Toaster position="bottom-center" richColors closeButton />
                </AdminAuthProvider>
            </body>
        </html>
    );
}
