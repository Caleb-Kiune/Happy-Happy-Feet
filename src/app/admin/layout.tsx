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
        <div
            className={`${inter.variable} font-sans antialiased bg-gray-50/50 text-gray-900 min-h-screen selection:bg-pink-100 selection:text-pink-900`}
        >
            <AdminAuthProvider>
                <AdminNav />
                {/* 
                  Desktop: Add left padding for fixed sidebar (w-72 = 18rem for more air) 
                  Mobile: Add bottom padding for better bottom bar clearance
                */}
                <div className="md:pl-72 pb-24 md:pb-8 pt-6 md:pt-8 min-h-screen transition-all duration-300 ease-in-out">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
                <Toaster position="bottom-right" richColors closeButton className="font-sans" />
            </AdminAuthProvider>
        </div>
    );
}
