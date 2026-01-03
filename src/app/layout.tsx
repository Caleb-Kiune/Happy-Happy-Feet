import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Happy Happy Feet",
    default: "Happy Happy Feet – Comfortable & Stylish Women's Shoes",
  },
  description: "Discover our curated collection of women's shoes designed for joy and comfort. Heels, sandals, sneakers, and flats for every occasion.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-[#111111] flex flex-col min-h-screen`}
      >
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
