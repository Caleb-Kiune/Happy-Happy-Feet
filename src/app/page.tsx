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

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />

      {/* Featured Section */}
      <section className="py-20 md:py-28 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-sans text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                Featured Collection
              </h2>
              <p className="mt-2 text-gray-500">
                Our most loved styles for the season.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-accent-500 font-medium hover:text-accent-600 transition-colors"
            >
              View all shoes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ShoeCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Link
              href="/shop"
              className="inline-block rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-gray-900 hover:border-accent-500 hover:text-accent-500 transition-colors"
            >
              View full collection
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
