import Image from "next/image";
import Link from "next/link";

// Primary premium lifestyle image
const HERO_IMAGE = "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2400";

export default function Hero() {
    return (
        <section id="homepage-hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image - Full Bleed */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={HERO_IMAGE}
                    alt="Woman wearing elegant comfortable heels"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                    quality={95}
                />
                {/* Overlay 1: Base dark tint for general contrast */}
                <div className="absolute inset-0 bg-black/30 z-[1]" />

                {/* Overlay 2: Vertical gradient scrim (Darker top/bottom) for editorial framing */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-[2]" />


            </div>

            {/* Content centered - Padding top accounts for the visual balance with the header */}
            <div className="relative z-10 w-full max-w-4xl px-6 pt-32 text-center text-white animate-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 drop-shadow-xl">
                    Step into <br className="hidden sm:block" />
                    Comfort & Style
                </h1>

                <p className="text-lg md:text-xl font-light tracking-wide mb-10 text-white/90 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
                    Premium footwear designed for the modern lifestyle. Experience joy with every step.
                </p>

                <Link
                    href="/shop"
                    className="group relative inline-flex items-center justify-center bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-900 transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-xl"
                >
                    Shop Collection
                </Link>
            </div>
        </section>
    );
}
