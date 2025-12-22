import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Size Guide | Happy Happy Feet",
    description: "Find your perfect fit with our comprehensive women's shoe size guide.",
};

const SIZE_CHART = [
    { eu: "36", cm: "23.0", uk: "3.5", us: "6" },
    { eu: "37", cm: "23.5", uk: "4", us: "6.5" },
    { eu: "38", cm: "24.0", uk: "5", us: "7.5" },
    { eu: "39", cm: "24.5", uk: "6", us: "8.5" },
    { eu: "40", cm: "25.0", uk: "6.5", us: "9" },
    { eu: "41", cm: "25.5", uk: "7.5", us: "9.5" },
    { eu: "42", cm: "26.0", uk: "8", us: "10" },
];

export default function SizeGuidePage() {
    return (
        <div className="bg-white py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-sans text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                        Size Guide
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Find the perfect fit for your happy feet.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-3xl">
                    <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-100 text-gray-900 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 rounded-tl-lg">EU Size</th>
                                        <th className="px-6 py-3">Length (CM)</th>
                                        <th className="px-6 py-3">UK</th>
                                        <th className="px-6 py-3 rounded-tr-lg">US</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {SIZE_CHART.map((row) => (
                                        <tr key={row.eu}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{row.eu}</td>
                                            <td className="px-6 py-4">{row.cm} cm</td>
                                            <td className="px-6 py-4">{row.uk}</td>
                                            <td className="px-6 py-4">{row.us}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="font-medium text-gray-900 mb-2">How to Measure</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                To get the most accurate measurement, place your foot on a piece of paper and mark the tip of your longest toe and the back of your heel. Measure the distance between these two points in centimeters. Use the chart above to find your corresponding EU size.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
