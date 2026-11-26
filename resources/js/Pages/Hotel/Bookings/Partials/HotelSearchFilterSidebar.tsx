import { useState } from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';
import {
    PriceSearchFilterReq,
    PriceSearchFiltersResponse,
} from '@/types/index-hotel';

interface Props {
    availableFilters: PriceSearchFiltersResponse | null;
    activeFilters: PriceSearchFilterReq;
    onChange: (filters: PriceSearchFilterReq) => void;
    onReset: () => void;
}

export default function HotelSearchFilterSidebar({
    availableFilters,
    activeFilters,
    onChange,
    onReset,
}: Props) {
    const [minPriceInput, setMinPriceInput] = useState(
        activeFilters.minPrice ?? '',
    );
    const [maxPriceInput, setMaxPriceInput] = useState(
        activeFilters.maxPrice ?? '',
    );
    const [showAllFacilities, setShowAllFacilities] = useState(false);

    const handlePriceBlur = () => {
        onChange({
            ...activeFilters,
            minPrice: minPriceInput ? minPriceInput : undefined,
            maxPrice: maxPriceInput ? maxPriceInput : undefined,
        });
    };

    const handleRatingToggle = (star: number) => {
        const current = activeFilters.minRating;
        onChange({
            ...activeFilters,
            minRating: current === star ? undefined : star,
        });
    };

    const handleAreaToggle = (area: string) => {
        const currentAreas = activeFilters.areas || [];
        const nextAreas = currentAreas.includes(area)
            ? currentAreas.filter((a) => a !== area)
            : [...currentAreas, area];

        onChange({
            ...activeFilters,
            areas: nextAreas.length > 0 ? nextAreas : undefined,
        });
    };

    const handleMealPlanToggle = (plan: string) => {
        const currentPlans = activeFilters.mealPlans || [];
        const nextPlans = currentPlans.includes(plan)
            ? currentPlans.filter((p) => p !== plan)
            : [...currentPlans, plan];

        onChange({
            ...activeFilters,
            mealPlans: nextPlans.length > 0 ? nextPlans : undefined,
        });
    };

    const handleFacilityToggle = (fac: string) => {
        const currentFacs = activeFilters.facilities || [];
        const nextFacs = currentFacs.includes(fac)
            ? currentFacs.filter((f) => f !== fac)
            : [...currentFacs, fac];

        onChange({
            ...activeFilters,
            facilities: nextFacs.length > 0 ? nextFacs : undefined,
        });
    };

    const hasActiveFilters = Boolean(
        activeFilters.minPrice ||
        activeFilters.maxPrice ||
        activeFilters.minRating ||
        (activeFilters.areas && activeFilters.areas.length > 0) ||
        (activeFilters.mealPlans && activeFilters.mealPlans.length > 0) ||
        (activeFilters.facilities && activeFilters.facilities.length > 0),
    );

    const facilitiesList = availableFilters?.facilities || [];
    const displayedFacilities = showAllFacilities
        ? facilitiesList
        : facilitiesList.slice(0, 6);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-6 border border-[#E2E8F0]">
            <div className="pb-3 border-gray-100 flex items-center justify-between border-b">
                <div className="gap-2 flex items-center">
                    <Filter size={16} className="text-primary" />
                    <h3 className="text-base font-bold text-primary">Filter</h3>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            setMinPriceInput('');
                            setMaxPriceInput('');
                            onReset();
                        }}
                        className="gap-1 text-xs font-semibold text-red-500 hover:text-red-700 flex items-center transition-colors"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-quaternary uppercase">
                    Price Range (IDR)
                </h4>
                <div className="gap-2 grid grid-cols-2">
                    <div>
                        <label className="text-quaternary font-medium mb-1 block text-[10px]">
                            Min Price
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            onBlur={handlePriceBlur}
                            className="text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-primary focus:border-primary w-full border border-[#E2E8F0] outline-none focus:ring-1"
                        />
                    </div>
                    <div>
                        <label className="text-quaternary font-medium mb-1 block text-[10px]">
                            Max Price
                        </label>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            onBlur={handlePriceBlur}
                            className="text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-primary focus:border-primary w-full border border-[#E2E8F0] outline-none focus:ring-1"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 pt-4 border-gray-100 border-t">
                <h4 className="text-xs font-bold tracking-wider text-quaternary uppercase">
                    Hotel Star
                </h4>
                <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const isChecked = activeFilters.minRating === star;
                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingToggle(star)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex w-full items-center justify-between transition-colors ${
                                    isChecked
                                        ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold border'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div className="gap-1.5 flex items-center">
                                    <div className="text-amber-400 flex items-center">
                                        {Array.from({ length: star }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    size={13}
                                                    className="fill-amber-400 text-amber-400"
                                                />
                                            ),
                                        )}
                                    </div>
                                    <span>{star} Star</span>
                                </div>
                                <input
                                    type="radio"
                                    checked={isChecked}
                                    readOnly
                                    className="text-primary h-3.5 w-3.5 cursor-pointer focus:ring-0"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {availableFilters?.areas && availableFilters.areas.length > 0 && (
                <div className="space-y-2.5 pt-4 border-gray-100 border-t">
                    <h4 className="text-xs font-bold tracking-wider text-quaternary uppercase">
                        Area / Location
                    </h4>
                    <div className="space-y-1.5 max-h-48 pr-1 overflow-y-auto">
                        {availableFilters.areas.map((area) => {
                            const isChecked = Boolean(
                                activeFilters.areas?.includes(area),
                            );
                            return (
                                <label
                                    key={area}
                                    className="gap-2 text-xs text-gray-700 font-medium hover:text-primary py-0.5 flex cursor-pointer items-center select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleAreaToggle(area)}
                                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-gray-300"
                                    />
                                    <span className="line-clamp-1">{area}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {availableFilters?.mealPlans &&
                availableFilters.mealPlans.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-gray-100 border-t">
                        <h4 className="text-xs font-bold tracking-wider text-quaternary uppercase">
                            Breakfast Type / Meal Plan
                        </h4>
                        <div className="space-y-1.5">
                            {availableFilters.mealPlans.map((plan) => {
                                const isChecked = Boolean(
                                    activeFilters.mealPlans?.includes(plan),
                                );
                                return (
                                    <label
                                        key={plan}
                                        className="gap-2 text-xs text-gray-700 font-medium hover:text-primary py-0.5 flex cursor-pointer items-center select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() =>
                                                handleMealPlanToggle(plan)
                                            }
                                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-gray-300"
                                        />
                                        <span>{plan}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

            {facilitiesList.length > 0 && (
                <div className="space-y-2.5 pt-4 border-gray-100 border-t">
                    <h4 className="text-xs font-bold tracking-wider text-quaternary uppercase">
                        Facilities
                    </h4>
                    <div className="space-y-1.5">
                        {displayedFacilities.map((fac) => {
                            const isChecked = Boolean(
                                activeFilters.facilities?.includes(fac),
                            );
                            return (
                                <label
                                    key={fac}
                                    className="gap-2 text-xs text-gray-700 font-medium hover:text-primary py-0.5 flex cursor-pointer items-center select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() =>
                                            handleFacilityToggle(fac)
                                        }
                                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-gray-300"
                                    />
                                    <span className="line-clamp-1">{fac}</span>
                                </label>
                            );
                        })}
                        {facilitiesList.length > 6 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAllFacilities(!showAllFacilities)
                                }
                                className="font-bold text-primary pt-1 block text-[11px] hover:underline"
                            >
                                {showAllFacilities
                                    ? 'Hide'
                                    : `+ ${facilitiesList.length - 6} More`}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
