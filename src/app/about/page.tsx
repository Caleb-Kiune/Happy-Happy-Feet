import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Happy Happy Feet",
    description: "We believe every step should feel joyful. Discover our curated collection of comfortable, stylish women's shoes.",
};

export default function AboutPage() {
    return (
        <div className="bg-white py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-sans text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                        About Happy Happy Feet
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We believe that every step you take should be filled with joy.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-3xl space-y-8 text-base leading-7 text-gray-600">
                    <p>
                        Welcome to Happy Happy Feet, where style meets unparalleled comfort. We founded our brand with a simple mission: to provide women with shoes that make them smile.
                    </p>
                    <p>
                        Whether you're stepping into a boardroom, dancing at a wedding, or exploring the city on a weekend, your feet deserve to feel happy. We meticulously curate our collection to ensure that you never have to choose between looking good and feeling good.
                    </p>
                    <p>
                        Our selection ranges from elegant heels that support you all night, to breezy sandals perfect for sunny days, and versatile flats that carry you through your busy schedule.
                    </p>
                    <p className="font-medium text-gray-900">
                        Thank you for choosing us to be part of your journey. Here's to many happy steps ahead!
                    </p>
                </div>
            </Container>
        </div>
    );
}
