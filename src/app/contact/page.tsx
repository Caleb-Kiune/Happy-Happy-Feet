import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Get in Touch | Happy Happy Feet",
    description: "Contact us for orders, inquiries, or assistance. We're here to help you find your perfect pair.",
};

const PHONE_NUMBER = "254736315506";
const EMAIL = "hello@happyhappyfeet.com"; // Placeholder email

export default function ContactPage() {
    return (
        <div className="bg-white py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-sans text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We're here to help you find your perfect pair.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-md space-y-8">
                    <div className="flex flex-col gap-4">
                        <Button
                            asChild
                            className="w-full rounded-full py-8 text-lg font-semibold bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20"
                        >
                            <a
                                href={`https://wa.me/${PHONE_NUMBER}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-x-3"
                            >
                                <Phone className="h-6 w-6" />
                                Chat on WhatsApp
                            </a>
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                            Typical response time: Within 1 hour
                        </p>
                    </div>

                    <div className="border-t border-gray-100 pt-8 text-center">
                        <p className="text-gray-900 font-medium mb-2">Other Ways to Reach Us</p>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="inline-flex items-center gap-x-2 text-gray-600 hover:text-accent-500 transition-colors"
                        >
                            <Mail className="h-5 w-5" />
                            {EMAIL}
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    );
}
