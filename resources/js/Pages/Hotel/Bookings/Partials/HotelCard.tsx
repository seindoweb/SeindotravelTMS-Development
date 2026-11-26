import { formatRupiah } from '@/helpers';
import { HotelSearchResultItem } from '@/types/index-hotel';
import {
    Building,
    Check,
    Coffee,
    Copy,
    Loader2,
    MapPin,
    Star,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    hotel: HotelSearchResultItem;
    onSelect?: (hotel: HotelSearchResultItem) => void;
    isLoading?: boolean;
}

export default function HotelCard({
    hotel,
    onSelect,
    isLoading = false,
}: Props) {
    const [imageError, setImageError] = useState(false);
    const [copiedPrice, setCopiedPrice] = useState(false);

    const handleCopyPrice = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const priceText =
            `${(hotel.currency || 'IDR').trim()} ${formatRupiah(hotel.minPrices.sellingPrice).trim()}`
                .replace(/\s+/g, ' ')
                .trim();
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(priceText);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = priceText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        setCopiedPrice(true);
        setTimeout(() => setCopiedPrice(false), 500);
    };

    const ratingNum = parseInt(hotel.rating, 10) || 0;

    const facilityChips = (hotel.facilities || [])
        .map((f) => f.type)
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .slice(0, 4);

    const markup = hotel.minPrices.sellingPrice - hotel.minPrices.ntaPrice;
    // const markUpPersen = hotel.minPrices.sellingPrice / hotel.minPrices.ntaPrice * 100;

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 md:flex-row gap-5 hover:shadow-md hover:border-gray-300 flex flex-col border border-[#E2E8F0] transition-all duration-200">
            <div className="bg-gray-100 border-gray-100 md:w-64 h-52 rounded-xl relative w-full shrink-0 overflow-hidden border">
                {hotel.thumbnail && !imageError ? (
                    <img
                        src={hotel.thumbnail}
                        alt={hotel.name}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-gray-400 bg-gray-50 flex h-full w-full flex-col items-center justify-center">
                        <Building size={36} className="mb-1 text-gray-300" />
                        <span className="text-xs font-medium">No Image</span>
                    </div>
                )}

                {ratingNum > 0 && (
                    <div className="top-2.5 left-2.5 bg-amber-400/95 text-slate-900 px-2 py-0.5 rounded-md text-xs font-bold gap-1 shadow-sm backdrop-blur-sm absolute flex items-center">
                        <Star size={13} className="fill-slate-900" />
                        <span>
                            {ratingNum} Star{ratingNum > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="gap-2 flex items-start justify-between">
                        <div>
                            <h2
                                onClick={() => onSelect?.(hotel)}
                                className={`text-lg font-bold leading-snug sm:text-xl text-primary transition-colors ${
                                    onSelect
                                        ? 'hover:text-primary-bright cursor-pointer'
                                        : ''
                                }`}
                            >
                                {hotel.name}
                            </h2>
                            <div className="gap-1.5 text-xs text-quaternary mt-1 flex items-center">
                                <MapPin
                                    size={14}
                                    className="text-primary shrink-0"
                                />
                                <span className="line-clamp-1">
                                    {hotel.locations?.area
                                        ? `${hotel.locations.area}, ${hotel.locations.cityName || ''}`
                                        : hotel.locations?.addressMain ||
                                          hotel.locations?.cityName ||
                                          ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {hotel.minPrices?.roomName && (
                        <div className="mt-3 gap-2 bg-slate-50 border-slate-200/60 px-3 py-1.5 rounded-lg text-xs inline-flex flex-wrap items-center border">
                            <span className="font-semibold text-primary">
                                {hotel.minPrices.roomName}
                            </span>
                            {hotel.minPrices.mealPlanName && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="gap-1 font-medium text-emerald-700 flex items-center">
                                        <Coffee size={12} />
                                        {hotel.minPrices.mealPlanName}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {facilityChips.length > 0 && (
                        <div className="gap-1.5 mt-3 flex flex-wrap">
                            {facilityChips.map((chip, idx) => (
                                <span
                                    key={idx}
                                    className="font-medium text-quaternary px-2.5 py-0.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[11px]"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="gap-3 pt-4 mt-4 border-gray-100 sm:flex-row sm:items-end flex flex-col justify-between border-t">
                    <div>
                        <span className="tracking-wider text-quaternary font-bold block text-[11px] uppercase">
                            Starts from
                        </span>
                        <div className="gap-2 mt-0.5 flex flex-wrap items-center">
                            <div className="gap-1.5 flex items-center">
                                <span
                                    onClick={handleCopyPrice}
                                    title="Click to copy price"
                                    className="text-xl font-black sm:text-2xl text-primary hover:text-primary-bright cursor-pointer transition-colors select-all"
                                >
                                    {hotel.currency}
                                    {formatRupiah(hotel.minPrices.sellingPrice)}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyPrice}
                                    title={
                                        copiedPrice
                                            ? 'Price copied successfully!'
                                            : 'Copy price'
                                    }
                                    className={`gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-md inline-flex cursor-pointer items-center border transition-all ${
                                        copiedPrice
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 scale-105'
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-primary'
                                    }`}
                                >
                                    {copiedPrice ? (
                                        <>
                                            <Check
                                                size={11}
                                                className="text-emerald-600 stroke-[2.5]"
                                            />
                                            <span className="text-[10px]">
                                                Copied!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy
                                                size={11}
                                                className="text-gray-400 group-hover:text-primary"
                                            />
                                        </>
                                    )}
                                </button>
                            </div>
                            <span className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold px-2 py-0.5 rounded-md inline-flex items-center border text-[11px]">
                                <TrendingUp
                                    size={11}
                                    className="text-emerald-600"
                                />
                                <span>
                                    Includes markup: {hotel.currency}{' '}
                                    {formatRupiah(markup)}
                                </span>
                            </span>
                        </div>
                        {hotel.minPrices?.sellingPrice && (
                            <>
                                <span className="mt-2 text-xs font-medium text-quaternary block">
                                    Base Price: {hotel.currency}{' '}
                                    {formatRupiah(
                                        hotel.minPrices?.ntaPrice || 0,
                                    )}
                                    /night
                                </span>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onSelect?.(hotel)}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary-bright text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow gap-2 flex cursor-pointer items-center justify-center transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <span>Select Hotel</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
