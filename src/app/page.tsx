import Link from "next/link";
import Hero from "@/components/Hero";
import Container from "@/components/Container";
import ShoeCard from "@/components/ShoeCard";
import { getFeaturedProducts } from "@/lib/products";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Happy Happy Feet – Comfortable & Stylish Women's Shoes",
  description: "Step into comfort and style. A curated collection of women's shoes crafted for joy, designed for you.",
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />

      {/* Featured Section */}
      <section className="py-24 md:py-32 bg-white">
        <Container>
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <h2 className="font-sans text-3xl md:text-4xl font-bold tracking-widest text-gray-900 uppercase">
              Featured Collection
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-900 transition-all uppercase tracking-wider"
            >
              View All Styles
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ShoeCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            {/* Mobile-only extra CTA if needed, but top link covers it. Keeping minimal. */}
          </div>
        </Container>
      </section>
    </main>
  );
}
