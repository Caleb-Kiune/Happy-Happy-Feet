import Container from "@/components/Container";

export default function Loading() {
    return (
        <div className="bg-white pb-24 pt-8 md:pt-12">
            <Container>
                {/* Breadcrumb Skeleton */}
                <div className="mb-8 flex items-center gap-x-2">
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
                    {/* Image Gallery Skeleton */}
                    <div className="flex flex-col gap-y-4">
                        <div className="aspect-square w-full rounded-sm bg-gray-100 animate-pulse" />
                        <div className="flex gap-x-4">
                            <div className="h-20 w-20 rounded-sm bg-gray-100 animate-pulse" />
                            <div className="h-20 w-20 rounded-sm bg-gray-100 animate-pulse" />
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="flex flex-col">
                        <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="mt-4 h-8 w-32 bg-gray-100 rounded animate-pulse" />
                        <div className="mt-6 border-t border-b border-gray-100 py-6">
                            <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                            <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                        </div>
                        <div className="mt-8">
                            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-3" />
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 w-12 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 h-14 w-full bg-gray-100 rounded-full animate-pulse" />
                    </div>
                </div>
            </Container>
        </div>
    );
}
