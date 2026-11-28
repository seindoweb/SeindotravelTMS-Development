import Skeleton from '@/Components/Skeleton/Skeleton';

function SkeletonRow({ labelWidth = 'w-20', valueWidth = 'w-36' }: { labelWidth?: string; valueWidth?: string }) {
    return (
        <div className="grid grid-cols-[110px_1fr] gap-3 py-3 border-b border-[#F1F5F9] last:border-0 items-center">
            <Skeleton className={`h-3.5 ${labelWidth} rounded`} />
            <Skeleton className={`h-4 ${valueWidth} rounded`} />
        </div>
    );
}

function SkeletonCard({
    titleWidth = 'w-32',
    rows = 5,
    rowConfigs,
}: {
    titleWidth?: string;
    rows?: number;
    rowConfigs?: Array<{ labelWidth?: string; valueWidth?: string }>;
}) {
    return (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden w-full">
            <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 px-5 py-4">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <Skeleton className={`h-4 ${titleWidth} rounded`} />
            </div>
            <div className="px-5">
                {rowConfigs
                    ? rowConfigs.map((config, idx) => (
                          <SkeletonRow
                              key={idx}
                              labelWidth={config.labelWidth}
                              valueWidth={config.valueWidth}
                          />
                      ))
                    : Array.from({ length: rows }).map((_, idx) => (
                          <SkeletonRow key={idx} />
                      ))}
            </div>
        </div>
    );
}

export default function CustomerDetailSkeleton() {
    return (
        <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 bg-white lg:col-span-4 xl:col-span-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                    <div className="p-6 px-5">
                        <div className="flex justify-center mb-4 mt-6">
                            <Skeleton className="w-24 h-24 rounded-2xl" />
                        </div>

                        <div className="mb-5 flex flex-col items-center">
                            <Skeleton className="h-6 w-40 rounded-md" />
                            <Skeleton className="h-3.5 w-24 rounded-md mt-2" />
                            <Skeleton className="h-5 w-16 rounded-full mt-3" />
                        </div>

                        <div className="space-y-3 border-t border-[#F1F5F9] pt-5">
                            <div className="flex items-center gap-3 mt-2">
                                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-4/5 rounded" />
                                    <Skeleton className="h-3 w-1/3 rounded" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                                <div className="flex-1">
                                    <Skeleton className="h-3.5 w-3/5 rounded" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-2/3 rounded" />
                                    <Skeleton className="h-3 w-1/2 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-3">
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-5 w-28 rounded" />
                </div>

                <div className="pt-2 space-y-6">
                    <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-2">
                        <SkeletonCard
                            titleWidth="w-32"
                            rowConfigs={[
                                { labelWidth: 'w-16', valueWidth: 'w-24' },
                                { labelWidth: 'w-24', valueWidth: 'w-32' },
                                { labelWidth: 'w-28', valueWidth: 'w-28' },
                                { labelWidth: 'w-24', valueWidth: 'w-20' },
                                { labelWidth: 'w-28', valueWidth: 'w-40' },
                            ]}
                        />

                        <SkeletonCard
                            titleWidth="w-24"
                            rowConfigs={[
                                { labelWidth: 'w-20', valueWidth: 'w-48' },
                                { labelWidth: 'w-20', valueWidth: 'w-28' },
                                { labelWidth: 'w-16', valueWidth: 'w-24' },
                                { labelWidth: 'w-16', valueWidth: 'w-24' },
                                { labelWidth: 'w-20', valueWidth: 'w-16' },
                            ]}
                        />
                    </div>

                    <SkeletonCard
                        titleWidth="w-36"
                        rowConfigs={[
                            { labelWidth: 'w-28', valueWidth: 'w-20' },
                            { labelWidth: 'w-20', valueWidth: 'w-16' },
                            { labelWidth: 'w-20', valueWidth: 'w-24' },
                            { labelWidth: 'w-24', valueWidth: 'w-32' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
