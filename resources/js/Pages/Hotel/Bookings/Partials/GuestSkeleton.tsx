export default function GuestSkeleton() {
    return (
        <div className="gap-6 lg:grid-cols-12 animate-pulse grid grid-cols-1 items-start">
            <div className="space-y-6 lg:col-span-8">
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 border border-[#E2E8F0]">
                    <div className="pb-3 border-gray-100 flex items-center justify-between border-b">
                        <div className="space-y-1.5">
                            <div className="h-4 rounded-md bg-slate-200 w-44" />
                            <div className="h-3 rounded-md bg-slate-100 w-60" />
                        </div>
                        <div className="h-8 bg-slate-100 rounded-xl w-28" />
                    </div>
                    <div className="gap-3 sm:grid-cols-3 grid grid-cols-1">
                        <div className="h-12 bg-slate-50 border-slate-100 rounded-xl border" />
                        <div className="h-12 bg-slate-50 border-slate-100 rounded-xl border" />
                        <div className="h-12 bg-slate-50 border-slate-100 rounded-xl border" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 border border-[#E2E8F0]">
                    <div className="pb-4 border-gray-100 flex items-center justify-between border-b">
                        <div className="space-y-2">
                            <div className="h-5 rounded-md bg-slate-200 w-36" />
                            <div className="h-3.5 bg-slate-100 rounded-md w-72 max-w-full" />
                        </div>
                        <div className="w-24 h-8 bg-slate-100 rounded-xl" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((idx) => (
                            <div
                                key={idx}
                                className="bg-slate-50/70 border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 border"
                            >
                                <div className="mb-3.5 flex items-center justify-between">
                                    <div className="gap-2 flex items-center">
                                        <div className="w-5 h-5 bg-slate-200 rounded-full" />
                                        <div className="h-4 rounded bg-slate-200 w-28" />
                                    </div>
                                </div>

                                <div className="sm:grid-cols-12 gap-3.5 grid grid-cols-1">
                                    <div className="sm:col-span-3 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-16" />
                                        <div className="h-10 bg-white border-slate-200 rounded-xl border" />
                                    </div>
                                    <div className="sm:col-span-4 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                                        <div className="h-10 bg-white border-slate-200 rounded-xl border" />
                                    </div>
                                    <div className="sm:col-span-3 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                                        <div className="h-10 bg-white border-slate-200 rounded-xl border" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <div className="h-3.5 bg-slate-200 rounded w-12" />
                                        <div className="h-10 bg-white border-slate-200 rounded-xl border" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 border border-[#E2E8F0]">
                    <div className="pb-3 space-y-2 border-gray-100 border-b">
                        <div className="w-48 h-5 rounded-md bg-slate-200" />
                        <div className="h-3.5 bg-slate-100 rounded-md w-64 max-w-full" />
                    </div>

                    <div className="gap-2 pt-1 flex flex-wrap">
                        {[28, 24, 32, 28, 20, 36, 28, 24].map((width, i) => (
                            <div
                                key={i}
                                className={`h-8 bg-slate-100 border-slate-200 rounded-xl border w-${width}`}
                                style={{ width: `${width * 4}px` }}
                            />
                        ))}
                    </div>

                    <div className="pt-2 space-y-2">
                        <div className="h-3.5 bg-slate-200 rounded w-28" />
                        <div className="h-20 bg-slate-50 border-slate-200 rounded-xl w-full border" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 border border-[#E2E8F0]">
                    <div className="w-48 h-4 rounded bg-slate-200" />
                    <div className="bg-slate-50 border-slate-200/80 rounded-xl p-3.5 gap-3 flex items-start border">
                        <div className="h-6 rounded-md bg-slate-200 w-36 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3.5 bg-slate-100 rounded w-full" />
                            <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5 lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E2E8F0]">
                    <div className="h-36 bg-slate-200 relative">
                        <div className="bottom-3 left-3 right-3 space-y-1.5 absolute">
                            <div className="gap-1 flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 rounded bg-slate-300"
                                    />
                                ))}
                            </div>
                            <div className="h-5 rounded bg-slate-300 w-3/4" />
                        </div>
                    </div>

                    <div className="p-4 space-y-4 sm:p-5">
                        <div className="h-3.5 bg-slate-100 rounded w-4/5" />

                        <div className="gap-2 p-3 bg-slate-50 border-slate-200/80 rounded-xl grid grid-cols-2 border">
                            <div className="space-y-1.5 border-slate-200 pr-2 border-r">
                                <div className="h-2.5 bg-slate-200 rounded w-12" />
                                <div className="w-24 h-4 rounded bg-slate-200" />
                                <div className="h-2.5 bg-slate-100 rounded w-16" />
                            </div>
                            <div className="space-y-1.5 pl-2">
                                <div className="h-2.5 bg-slate-200 rounded w-12" />
                                <div className="w-24 h-4 rounded bg-slate-200" />
                                <div className="h-2.5 bg-slate-100 rounded w-16" />
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="w-24 h-4 rounded bg-slate-100" />
                            <div className="w-20 h-4 rounded bg-slate-100" />
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-2">
                            <div className="h-2.5 bg-slate-200 rounded w-20" />
                            <div className="h-5 rounded bg-slate-200 w-3/4" />
                            <div className="gap-2 pt-1 flex">
                                <div className="w-20 h-5 rounded bg-slate-100" />
                                <div className="w-24 h-5 rounded bg-slate-100" />
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
                            <div className="pt-2 border-slate-100 flex items-baseline justify-between border-t">
                                <div className="space-y-1">
                                    <div className="w-24 h-4 rounded bg-slate-200" />
                                    <div className="h-2.5 bg-slate-100 rounded w-28" />
                                </div>
                                <div className="w-32 rounded h-7 bg-slate-200" />
                            </div>
                        </div>

                        <div className="h-11 bg-slate-200 rounded-xl w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
