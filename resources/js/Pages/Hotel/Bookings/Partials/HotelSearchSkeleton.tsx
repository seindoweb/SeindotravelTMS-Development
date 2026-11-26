export default function HotelSearchSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-2xl p-5 md:flex-row gap-5 flex flex-col border border-[#E2E8F0]">
                <div className="bg-gray-200 md:w-56 h-44 rounded-xl w-full shrink-0" />
                <div className="py-1 space-y-3 flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="gap-2 pt-2 flex">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-20 h-6 bg-gray-100 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-5 sm:flex-row gap-4 flex flex-col items-start justify-between border border-[#E2E8F0]"
                >
                    <div className="space-y-2.5 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-100 rounded w-1/3" />
                        <div className="gap-2 flex">
                            <div className="w-24 h-5 bg-gray-100 rounded" />
                            <div className="w-20 h-5 bg-gray-100 rounded" />
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <div className="bg-gray-200 rounded h-7 w-36" />
                        <div className="w-24 h-4 bg-gray-100 rounded ml-auto" />
                        <div className="w-32 h-10 bg-gray-200 rounded-xl ml-auto" />
                    </div>
                </div>
            ))}
        </div>
    );
}
