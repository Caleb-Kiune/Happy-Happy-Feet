import { AdminAuthProvider } from "@/context/AdminAuthContext";
import AdminNav from "@/components/admin/AdminNav";
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
                    <AdminNav />
                    {/* 
                      Desktop: Add left padding to accommodate fixed sidebar (w-64 = 16rem) 
                      Mobile: Add bottom padding to accommodate bottom bar (h-16 = 4rem) 
                    */}
                    <div className="md:pl-64 pb-16 md:pb-0">
                        {children}
                    </div>
                    <Toaster position="bottom-center" richColors closeButton />
                </AdminAuthProvider>
            </body>
        </html>
    );
}
