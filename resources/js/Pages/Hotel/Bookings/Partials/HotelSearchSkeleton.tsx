export default function HotelSearchSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-56 h-44 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="flex gap-2 pt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 bg-gray-100 rounded-full w-20" />
                        ))}
                    </div>
                </div>
            </div>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col sm:flex-row items-start justify-between gap-4"
                >
                    <div className="flex-1 space-y-2.5">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-100 rounded w-1/3" />
                        <div className="flex gap-2">
                            <div className="h-5 bg-gray-100 rounded w-24" />
                            <div className="h-5 bg-gray-100 rounded w-20" />
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <div className="h-7 bg-gray-200 rounded w-36" />
                        <div className="h-4 bg-gray-100 rounded w-24 ml-auto" />
                        <div className="h-10 bg-gray-200 rounded-xl w-32 ml-auto" />
                    </div>
                </div>
            ))}
        </div>
    );
}