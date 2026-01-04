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
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_IMAGE}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="mt-4 flex flex-col gap-y-1 text-center">
                <h3 className="text-sm font-medium uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm font-light text-gray-500">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
}
