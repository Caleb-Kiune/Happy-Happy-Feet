export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start">
                        <div className="bg-gray-100 p-3 rounded-xl h-12 w-12" />
                        <div className="h-6 w-16 bg-gray-100 rounded-full" />
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-10 w-16 bg-gray-100 rounded" />
                        {i > 1 && <div className="h-3 w-32 bg-gray-50 rounded" />}
                    </div>
                </div>
            ))}
        </div>
    );
}
