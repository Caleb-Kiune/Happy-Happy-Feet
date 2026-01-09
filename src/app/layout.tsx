import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import { CartProvider } from "@/context/CartContext";
import { ShopSearchProvider } from "@/context/ShopSearchContext";
import { Toaster } from "@/components/ui/sonner";
import PageWrapper from "@/components/PageWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
        <ShopSearchProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">
              <PageWrapper>
                {children}
              </PageWrapper>
            </main>
            <FloatingWhatsApp />
            <ConditionalFooter />
            <Toaster position="bottom-center" richColors closeButton />
          </CartProvider>
        </ShopSearchProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
