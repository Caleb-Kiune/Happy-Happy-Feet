import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/products";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";

type ShoeCardProps = {
    product: Product;
};

export default function ShoeCard({ product }: ShoeCardProps) {
    return (
        <Link href={`/shop/${product.slug}`} className="group block">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 mb-4">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_IMAGE}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw"
                />
            </div>

            {/* Persistent Details - Clean & Minimalist */}
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm font-normal text-gray-500">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
}
