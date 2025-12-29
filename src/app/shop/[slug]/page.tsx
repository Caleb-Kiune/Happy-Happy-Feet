import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ProductDetail from "@/components/ProductDetail";
import ShoeCard from "@/components/ShoeCard";
import { getProductSlugsForStaticParams, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate static params for all products
export async function generateStaticParams() {
    return await getProductSlugsForStaticParams();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: `${product.name} | Happy Happy Feet`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(slug);

    return (
        <div className="bg-white pb-24 pt-8 md:pt-12">
            <Container>
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-x-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-900 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-gray-900 transition-colors">
                        Shop
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-gray-900 line-clamp-1">
                        {product.name}
                    </span>
                </nav>

                {/* Product Details */}
                <ProductDetail product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <h2 className="mb-10 font-sans text-2xl font-medium text-gray-900 sm:text-3xl">
                            You might also like
                        </h2>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((related) => (
                                <ShoeCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}
