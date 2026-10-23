export default function GuestSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-pulse">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="space-y-1.5">
                            <div className="h-4 bg-slate-200 rounded-md w-44" />
                            <div className="h-3 bg-slate-100 rounded-md w-60" />
                        </div>
                        <div className="h-8 bg-slate-100 rounded-xl w-28" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-200 rounded-md w-36" />
                            <div className="h-3.5 bg-slate-100 rounded-md w-72 max-w-full" />
                        </div>
                        <div className="h-8 bg-slate-100 rounded-xl w-24" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((idx) => (
                            <div
                                key={idx}
                                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5"
                            >
                                <div className="flex items-center justify-between mb-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200" />
                                        <div className="h-4 bg-slate-200 rounded w-28" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                    <div className="sm:col-span-3 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-16" />
                                        <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                                    </div>
                                    <div className="sm:col-span-4 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                                        <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                                    </div>
                                    <div className="sm:col-span-3 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                                        <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-12" />
                                        <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="space-y-2 pb-3 border-b border-gray-100">
                        <div className="h-5 bg-slate-200 rounded-md w-48" />
                        <div className="h-3.5 bg-slate-100 rounded-md w-64 max-w-full" />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {[28, 24, 32, 28, 20, 36, 28, 24].map((width, i) => (
                            <div
                                key={i}
                                className={`h-8 bg-slate-100 border border-slate-200 rounded-xl w-${width}`}
                                style={{ width: `${width * 4}px` }}
                            />
                        ))}
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="h-3.5 bg-slate-200 rounded w-28" />
                        <div className="h-20 bg-slate-50 border border-slate-200 rounded-xl w-full" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-48" />
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="h-6 bg-slate-200 rounded-md w-36 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 bg-slate-100 rounded w-full" />
                            <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="h-36 bg-slate-200 relative">
                        <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-3 h-3 bg-slate-300 rounded" />
                                ))}
                            </div>
                            <div className="h-5 bg-slate-300 rounded w-3/4" />
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-4">
                        <div className="h-3.5 bg-slate-100 rounded w-4/5" />

                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2">
                            <div className="space-y-1.5 border-r border-slate-200 pr-2">
                                <div className="h-2.5 bg-slate-200 rounded w-12" />
                                <div className="h-4 bg-slate-200 rounded w-24" />
                                <div className="h-2.5 bg-slate-100 rounded w-16" />
                            </div>
                            <div className="space-y-1.5 pl-2">
                                <div className="h-2.5 bg-slate-200 rounded w-12" />
                                <div className="h-4 bg-slate-200 rounded w-24" />
                                <div className="h-2.5 bg-slate-100 rounded w-16" />
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="h-4 bg-slate-100 rounded w-24" />
                            <div className="h-4 bg-slate-100 rounded w-20" />
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-2">
                            <div className="h-2.5 bg-slate-200 rounded w-20" />
                            <div className="h-5 bg-slate-200 rounded w-3/4" />
                            <div className="flex gap-2 pt-1">
                                <div className="h-5 bg-slate-100 rounded w-20" />
                                <div className="h-5 bg-slate-100 rounded w-24" />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-2.5">
                            <div className="flex justify-between">
                                <div className="h-3.5 bg-slate-100 rounded w-24" />
                                <div className="h-3.5 bg-slate-200 rounded w-24" />
                            </div>
                            <div className="flex justify-between">
                                <div className="h-3.5 bg-slate-100 rounded w-20" />
                                <div className="h-3.5 bg-slate-200 rounded w-20" />
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                                <div className="space-y-1">
                                    <div className="h-4 bg-slate-200 rounded w-24" />
                                    <div className="h-2.5 bg-slate-100 rounded w-28" />
                                </div>
                                <div className="h-7 bg-slate-200 rounded w-32" />
                            </div>
                        </div>

                        <div className="h-11 bg-slate-200 rounded-xl w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
