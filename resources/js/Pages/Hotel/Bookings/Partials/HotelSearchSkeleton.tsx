export default function HotelSearchSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] space-y-5">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-9 bg-gray-100 rounded-lg"></div>
                        <div className="h-9 bg-gray-100 rounded-lg"></div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-5 bg-gray-100 rounded w-4/5"></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-5 bg-gray-100 rounded w-3/4"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Cards Skeleton */}
            <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                </div>

                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 flex flex-col md:flex-row gap-5"
                    >
                        {/* Image Skeleton */}
                        <div className="w-full md:w-64 h-48 bg-gray-200 rounded-xl shrink-0"></div>

                        {/* Content Skeleton */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="space-y-2.5">
                                <div className="flex gap-2 items-center">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-100 rounded w-20"></div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                <div className="flex gap-2 pt-2">
                                    <div className="h-6 bg-gray-100 rounded-full w-20"></div>
                                    <div className="h-6 bg-gray-100 rounded-full w-24"></div>
                                    <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                                </div>
                            </div>

                            {/* Price / CTA Skeleton */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                                <div className="space-y-1">
                                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                                    <div className="h-3 bg-gray-100 rounded w-28"></div>
                                </div>
                                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
