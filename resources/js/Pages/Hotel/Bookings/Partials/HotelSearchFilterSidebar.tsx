import { PriceSearchFilterReq, PriceSearchFiltersResponse } from '@/types';
import { Filter, RotateCcw, Star } from 'lucide-react';
import { useState } from 'react';

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
    const [minPriceInput, setMinPriceInput] = useState(activeFilters.minPrice ?? '');
    const [maxPriceInput, setMaxPriceInput] = useState(activeFilters.maxPrice ?? '');
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
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-primary" />
                    <h3 className="font-bold text-base text-primary">Filter</h3>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            setMinPriceInput('');
                            setMaxPriceInput('');
                            onReset();
                        }}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-quaternary">
                    Kisaran Harga (IDR)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] text-quaternary font-medium block mb-1">
                            Min Price
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            onBlur={handlePriceBlur}
                            className="w-full text-xs font-medium border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-quaternary font-medium block mb-1">
                            Max Price
                        </label>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            onBlur={handlePriceBlur}
                            className="w-full text-xs font-medium border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-quaternary">
                    Bintang Hotel
                </h4>
                <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const isChecked = activeFilters.minRating === star;
                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingToggle(star)}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    isChecked
                                        ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center text-amber-400">
                                        {Array.from({ length: star }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className="fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <span>{star} Bintang</span>
                                </div>
                                <input
                                    type="radio"
                                    checked={isChecked}
                                    readOnly
                                    className="text-primary focus:ring-0 cursor-pointer h-3.5 w-3.5"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {availableFilters?.areas && availableFilters.areas.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-quaternary">
                        Area / Wilayah
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {availableFilters.areas.map((area) => {
                            const isChecked = Boolean(
                                activeFilters.areas?.includes(area),
                            );
                            return (
                                <label
                                    key={area}
                                    className="flex items-center gap-2 text-xs text-gray-700 font-medium hover:text-primary cursor-pointer select-none py-0.5"
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

            {availableFilters?.mealPlans && availableFilters.mealPlans.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-quaternary">
                        Tipe Sarapan / Meal Plan
                    </h4>
                    <div className="space-y-1.5">
                        {availableFilters.mealPlans.map((plan) => {
                            const isChecked = Boolean(
                                activeFilters.mealPlans?.includes(plan),
                            );
                            return (
                                <label
                                    key={plan}
                                    className="flex items-center gap-2 text-xs text-gray-700 font-medium hover:text-primary cursor-pointer select-none py-0.5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleMealPlanToggle(plan)}
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
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-quaternary">
                        Fasilitas
                    </h4>
                    <div className="space-y-1.5">
                        {displayedFacilities.map((fac) => {
                            const isChecked = Boolean(
                                activeFilters.facilities?.includes(fac),
                            );
                            return (
                                <label
                                    key={fac}
                                    className="flex items-center gap-2 text-xs text-gray-700 font-medium hover:text-primary cursor-pointer select-none py-0.5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleFacilityToggle(fac)}
                                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-gray-300"
                                    />
                                    <span className="line-clamp-1">{fac}</span>
                                </label>
                            );
                        })}
                        {facilitiesList.length > 6 && (
                            <button
                                type="button"
                                onClick={() => setShowAllFacilities(!showAllFacilities)}
                                className="text-[11px] font-bold text-primary hover:underline pt-1 block"
                            >
                                {showAllFacilities
                                    ? 'Sembunyikan'
                                    : `+ ${facilitiesList.length - 6} Lainnya`}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
