import Container from "@/components/Container";

export default function Hero() {
    return (
        <section className="flex flex-grow flex-col justify-center py-24 md:py-32 lg:py-40">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="font-sans text-5xl font-medium tracking-tight text-gray-900 sm:text-6xl mb-6">
                        Happy Happy Feet
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-500 mb-10 font-normal">
                        Step into comfort and style. A curated collection of women's shoes
                        crafted for joy, designed for you.
                    </p>
                    <div className="flex items-center justify-center gap-x-6">
                        <a
                            href="#"
                            className="text-base font-semibold leading-7 text-accent-500 hover:text-accent-600 transition-colors duration-200"
                        >
                            Explore our collection <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
