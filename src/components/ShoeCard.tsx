import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/products";

type ShoeCardProps = {
    product: Product;
};

export default function ShoeCard({ product }: ShoeCardProps) {
    return (
        <Link href={`/shop/${product.slug}`} className="group block">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="mt-4 flex flex-col gap-y-1">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-accent-500 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm font-normal text-gray-500">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
}
