import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

// Primary premium lifestyle image
const HERO_IMAGE = "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2400";

export default function Hero() {
    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Image with Priority */}
            <Image
                src={HERO_IMAGE}
                alt="Woman wearing elegant comfortable heels"
                fill
                priority
                className="object-cover object-center"
                quality={95}
            />

            {/* Gradient Overlay & Scrim for Readability */}
            <div className="absolute inset-0 bg-black/20" /> {/* General scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" /> {/* Gradient */}

            {/* Content Content - Centered */}
            <div className="relative z-10 w-full">
                <Container className="flex flex-col items-center justify-center text-center">
                    <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest text-white uppercase mb-6 drop-shadow-sm">
                        Happy Happy Feet
                    </h1>

                    <p className="max-w-xl text-lg sm:text-xl md:text-2xl text-white/90 font-light mb-10 tracking-wide leading-relaxed drop-shadow-md">
                        Elevated Comfort. Timeless Style.
                    </p>

                    <Link
                        href="/shop"
                        className="group relative inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white border border-transparent hover:border-white"
                    >
                        Shop Collection
                    </Link>
                </Container>
            </div>
        </section>
    );
}
