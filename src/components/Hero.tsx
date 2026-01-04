import Image from "next/image";
import Link from "next/link";

// Primary premium lifestyle image
const HERO_IMAGE = "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2400";

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] md:min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">

            {/* Left Column: Brand & Content */}
            <div className="order-1 md:order-1 flex flex-col justify-center items-center text-center p-8 pt-20 md:p-12 lg:p-16 relative">

                {/* Massive Brand Logo */}
                {/* Mobile: h-32 | Tablet: h-48 | Desktop: h-64 to h-80 */}
                <div className="relative w-auto max-w-full h-32 sm:h-48 md:h-64 lg:h-80 mb-8 md:mb-12 animate-in fade-in zoom-in duration-700">
                    <Image
                        src="/logo.svg"
                        alt="Happy Happy Feet"
                        width={500}
                        height={500}
                        className="h-full w-auto object-contain drop-shadow-sm"
                        priority
                    />
                </div>

                <div className="max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
                    <h2 className="text-xl md:text-2xl text-gray-900 font-light tracking-wide leading-relaxed">
                        Step into <br className="hidden sm:block" />
                        comfort and style
                    </h2>

                    <Link
                        href="/shop"
                        className="group relative inline-flex items-center justify-center bg-gray-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
                    >
                        Shop Collection
                    </Link>
                </div>
            </div>

            {/* Right Column: Lifestyle Image */}
            <div className="order-2 md:order-2 relative h-[50vh] md:h-auto min-h-[400px] w-full bg-gray-200 overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="Woman wearing elegant comfortable heels"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-1000 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={95}
                />
            </div>

        </section>
    );
}
