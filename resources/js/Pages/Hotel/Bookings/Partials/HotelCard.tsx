import { HotelSearchResultItem } from '@/types';
import { Building, Coffee, MapPin, Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
    hotel: HotelSearchResultItem;
    onSelect?: (hotel: HotelSearchResultItem) => void;
}

const formatRupiah = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(num)
        .replace('Rp', 'Rp ');
};

export default function HotelCard({ hotel, onSelect }: Props) {
    const [imageError, setImageError] = useState(false);

    const ratingNum = parseInt(hotel.rating, 10) || 0;

    const facilityChips = (hotel.facilities || [])
        .map((f) => f.type)
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .slice(0, 4);

    return (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 flex flex-col md:flex-row gap-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="relative w-full md:w-64 h-52 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                {hotel.thumbnail && !imageError ? (
                    <img
                        src={hotel.thumbnail}
                        alt={hotel.name}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <Building size={36} className="text-gray-300 mb-1" />
                        <span className="text-xs font-medium">No Image</span>
                    </div>
                )}

                {ratingNum > 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-amber-400/95 text-slate-900 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
                        <Star size={13} className="fill-slate-900" />
                        <span>{ratingNum} Star{ratingNum > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-primary leading-snug">
                                {hotel.name}
                            </h2>
                            <div className="flex items-center gap-1.5 text-xs text-quaternary mt-1">
                                <MapPin size={14} className="text-primary shrink-0" />
                                <span className="line-clamp-1">
                                    {hotel.locations?.area
                                        ? `${hotel.locations.area}, ${hotel.locations.cityName || ''}`
                                        : hotel.locations?.addressMain || hotel.locations?.cityName || ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {hotel.minPrices?.roomName && (
                        <div className="mt-3 inline-flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg text-xs">
                            <span className="font-semibold text-primary">
                                {hotel.minPrices.roomName}
                            </span>
                            {hotel.minPrices.mealPlanName && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                                        <Coffee size={12} />
                                        {hotel.minPrices.mealPlanName}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {facilityChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {facilityChips.map((chip, idx) => (
                                <span
                                    key={idx}
                                    className="text-[11px] font-medium bg-[#F8FAFC] text-quaternary border border-[#E2E8F0] px-2.5 py-0.5 rounded-full"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                        <span className="text-[11px] uppercase tracking-wider text-quaternary font-bold block">
                            Mulai Dari
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xl sm:text-2xl font-black text-primary">
                                {formatRupiah(hotel.minPrices?.sellingPricePerNight || 0)}
                            </span>
                            <span className="text-xs text-quaternary font-medium">
                                / malam
                            </span>
                        </div>
                        {hotel.minPrices?.sellingPrice && (
                            <span className="text-xs text-quaternary font-medium block mt-0.5">
                                Total: {formatRupiah(hotel.minPrices.sellingPrice)} (termasuk pajak)
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onSelect?.(hotel)}
                        className="bg-primary hover:bg-primary-bright text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Pilih Hotel</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
