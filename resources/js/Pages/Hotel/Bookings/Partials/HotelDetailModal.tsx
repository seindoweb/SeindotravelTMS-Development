import PhotoLightbox from '@/Components/PhotoLightBox';
import { HotelDetailInfo } from '@/types/index-hotel';
import {
    ArrowUpDown,
    Building2,
    Calendar,
    Car,
    CheckCircle2,
    Cigarette,
    Clock,
    Dumbbell,
    ExternalLink,
    Images,
    MapPin,
    Sparkles,
    Star,
    Utensils,
    Waves,
    Wifi,
    Wind,
    Wine,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface HotelDetailModalProps {
    hotel: HotelDetailInfo;
    photos: { url: string; isMain: boolean }[];
    nights?: number;
    onClose: () => void;
}

const getFacilityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
    if (
        lower.includes('pool') ||
        lower.includes('kolam') ||
        lower.includes('renang')
    )
        return Waves;
    if (
        lower.includes('restoran') ||
        lower.includes('restaurant') ||
        lower.includes('dining') ||
        lower.includes('makan') ||
        lower.includes('breakfast') ||
        lower.includes('cafe')
    )
        return Utensils;
    if (lower.includes('parkir') || lower.includes('parking')) return Car;
    if (lower.includes('ac') || lower.includes('air condition')) return Wind;
    if (
        lower.includes('24') ||
        lower.includes('resepsionis') ||
        lower.includes('front desk')
    )
        return Clock;
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('spa') || lower.includes('massage')) return Sparkles;
    if (lower.includes('bar') || lower.includes('lounge')) return Wine;
    if (lower.includes('smoking') || lower.includes('rokok')) return Cigarette;
    if (lower.includes('lift') || lower.includes('elevator'))
        return ArrowUpDown;
    return CheckCircle2;
};

export default function HotelDetailModal({
    hotel,
    photos,
    nights,
    onClose,
}: HotelDetailModalProps) {
    const [activeTab, setActiveTab] = useState<
        'facilities' | 'photos' | 'location'
    >('facilities');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const ratingNum = parseInt(hotel.rating, 10) || 0;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && lightboxIndex === null) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, onClose]);

    const groupedFacilities = (hotel.facilities || []).reduce<
        { category: string; items: string[] }[]
    >((acc, f) => {
        const category = f.type?.trim() || 'Fasilitas Umum';
        const name = f.name?.trim() || f.type?.trim();
        if (!name) return acc;

        let existing = acc.find(
            (g) => g.category.toLowerCase() === category.toLowerCase(),
        );
        if (!existing) {
            existing = { category, items: [] };
            acc.push(existing);
        }
        if (!existing.items.includes(name)) {
            existing.items.push(name);
        }
        return acc;
    }, []);

    const fullAddress = [
        hotel.locations?.addressMain,
        hotel.locations?.addressAlternative,
        hotel.locations?.area,
        hotel.locations?.cityName,
        hotel.locations?.zipCode,
        hotel.locations?.countryName,
    ]
        .filter(Boolean)
        .join(', ');

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel.name} ${hotel.locations?.cityName || ''} ${hotel.locations?.countryName || ''}`,
    )}`;

    return (
        <>
            <div
                className="inset-0 bg-black/60 backdrop-blur-sm fixed z-[100] transition-opacity"
                onClick={onClose}
            />

            <div className="inset-0 p-3 sm:p-6 pointer-events-none fixed z-[110] flex items-center justify-center overflow-y-auto">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-3xl animate-in fade-in zoom-in-95 pointer-events-auto relative flex max-h-[90vh] w-full flex-col overflow-hidden duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="gap-4 px-5 pt-5 pb-4 border-gray-100 sm:px-6 flex items-start justify-between border-b">
                        <div className="pr-6 space-y-1">
                            <div className="gap-2 flex flex-wrap items-center">
                                <span className="gap-1 font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-flex items-center text-[11px]">
                                    <Building2 size={12} />
                                    Accommodation
                                </span>
                                {ratingNum > 0 && (
                                    <div className="gap-1 bg-amber-50 text-amber-800 border-amber-200/60 px-2 py-0.5 rounded-md font-bold flex items-center border text-[11px]">
                                        <Star
                                            size={11}
                                            className="fill-amber-400 text-amber-500"
                                        />
                                        <span>Star {ratingNum}</span>
                                    </div>
                                )}
                                {nights && nights > 0 && (
                                    <span className="gap-1 font-semibold text-quaternary bg-slate-100 px-2 py-0.5 rounded-md inline-flex items-center text-[11px]">
                                        <Calendar size={11} />
                                        {nights} Nights
                                    </span>
                                )}
                            </div>

                            <h2 className="text-xl font-black leading-tight sm:text-2xl text-primary">
                                {hotel.name}
                            </h2>

                            <div className="gap-1.5 text-xs text-quaternary flex items-center">
                                <MapPin
                                    size={13}
                                    className="text-primary shrink-0"
                                />
                                <span className="line-clamp-1">
                                    {fullAddress ||
                                        hotel.locations?.cityName ||
                                        'Hotel Location'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 shrink-0 rounded-full transition-colors"
                            aria-label="Tutup"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="gap-2 px-5 border-gray-100 sm:px-6 sm:gap-4 bg-slate-50/60 flex shrink-0 border-b">
                        <button
                            onClick={() => setActiveTab('facilities')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold gap-1.5 flex cursor-pointer items-center border-b-2 transition-all ${
                                activeTab === 'facilities'
                                    ? 'border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-900 border-transparent'
                            }`}
                        >
                            <Sparkles size={14} />
                            Facilities ({groupedFacilities.length} Categories)
                        </button>
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold gap-1.5 flex cursor-pointer items-center border-b-2 transition-all ${
                                activeTab === 'photos'
                                    ? 'border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-900 border-transparent'
                            }`}
                        >
                            <Images size={14} />
                            All Photos ({photos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('location')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold gap-1.5 flex cursor-pointer items-center border-b-2 transition-all ${
                                activeTab === 'location'
                                    ? 'border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-900 border-transparent'
                            }`}
                        >
                            <MapPin size={14} />
                            Location & Address
                        </button>
                    </div>

                    <div className="p-5 space-y-5 sm:p-6 flex-1 overflow-y-auto">
                        {activeTab === 'facilities' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Facilities by Category
                                        </h3>
                                        <p className="text-xs text-quaternary mt-0.5">
                                            Details of facilities and services
                                            based on category type
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 shrink-0 rounded-full">
                                        {groupedFacilities.length} Categories
                                    </span>
                                </div>

                                {groupedFacilities.length > 0 ? (
                                    <div className="md:grid-cols-2 gap-3.5 grid grid-cols-1">
                                        {groupedFacilities.map((group, idx) => {
                                            const IconComp = getFacilityIcon(
                                                group.category,
                                            );
                                            return (
                                                <div
                                                    key={idx}
                                                    className="p-4 space-y-3 bg-slate-50/70 border-slate-200/80 rounded-2xl hover:border-slate-300 flex flex-col justify-between border transition-colors"
                                                >
                                                    <div className="gap-2 border-slate-200/60 pb-2.5 flex items-center justify-between border-b">
                                                        <div className="gap-2.5 flex items-center">
                                                            <div className="w-8 h-8 bg-white rounded-xl border-slate-200/80 text-primary shadow-2xs flex shrink-0 items-center justify-center border">
                                                                <IconComp
                                                                    size={16}
                                                                />
                                                            </div>
                                                            <h4 className="text-sm font-bold text-slate-800">
                                                                {group.category}
                                                            </h4>
                                                        </div>
                                                        <span className="font-medium text-quaternary bg-white border-slate-200/60 px-2 py-0.5 rounded-md shrink-0 border text-[11px]">
                                                            {group.items.length}{' '}
                                                            info
                                                        </span>
                                                    </div>

                                                    <ul className="space-y-2 flex-1">
                                                        {group.items.map(
                                                            (item, itemIdx) => (
                                                                <li
                                                                    key={
                                                                        itemIdx
                                                                    }
                                                                    className="gap-2 text-xs leading-relaxed text-slate-600 flex items-start"
                                                                >
                                                                    <CheckCircle2
                                                                        size={
                                                                            13
                                                                        }
                                                                        className="text-emerald-600 mt-0.5 shrink-0"
                                                                    />
                                                                    <span>
                                                                        {item}
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-10 text-xs bg-slate-50 rounded-xl border-slate-100 text-quaternary border text-center">
                                        No detailed facility information has
                                        been provided by the property.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'photos' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Hotel & Room Gallery
                                    </h3>
                                    <span className="text-xs text-quaternary">
                                        Click photo to enlarge
                                    </span>
                                </div>

                                {photos.length > 0 ? (
                                    <div className="sm:grid-cols-3 md:grid-cols-4 gap-2.5 grid grid-cols-2">
                                        {photos.map((photo, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() =>
                                                    setLightboxIndex(idx)
                                                }
                                                className="bg-gray-100 border-gray-200 group rounded-xl shadow-2xs hover:shadow-md relative aspect-4/3 cursor-pointer overflow-hidden border transition-all"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={`${hotel.name} foto ${idx + 1}`}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="inset-0 bg-black/0 group-hover:bg-black/20 absolute flex items-center justify-center transition-colors">
                                                    <span className="px-2 py-1 text-xs font-bold text-white rounded-md bg-black/50 backdrop-blur-xs opacity-0 transition-opacity group-hover:opacity-100">
                                                        Enlarge
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-xs bg-slate-50 rounded-xl border-slate-100 text-quaternary border text-center">
                                        No photos are available for this hotel.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="space-y-4">
                                <div className="p-4 space-y-3 bg-slate-50 border-slate-200/80 rounded-2xl sm:p-5 border">
                                    <div className="gap-3 flex items-start">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary mt-0.5 flex shrink-0 items-center justify-center">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Property Address
                                            </h4>
                                            <p className="text-xs leading-relaxed sm:text-sm text-slate-600">
                                                {fullAddress ||
                                                    'Address Not Available'}
                                            </p>
                                        </div>
                                    </div>

                                    {hotel.locations?.landmark && (
                                        <div className="pt-3 text-xs border-slate-200/60 text-slate-600 border-t">
                                            <span className="font-semibold text-slate-800">
                                                Nearby Landmark:{' '}
                                            </span>
                                            {hotel.locations.landmark}
                                        </div>
                                    )}

                                    <div className="pt-3">
                                        <a
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gap-1.5 bg-primary hover:bg-primary-bright text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center transition-all active:scale-[0.98]"
                                        >
                                            <ExternalLink size={13} />
                                            <span>Open in Google Maps</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="gap-3 sm:grid-cols-3 grid grid-cols-2">
                                    <div className="p-3 bg-white border-slate-200/70 rounded-xl border">
                                        <span className="font-bold text-quaternary tracking-wider block text-[10px] uppercase">
                                            City
                                        </span>
                                        <span className="text-xs font-semibold sm:text-sm text-slate-800">
                                            {hotel.locations?.cityName || '-'}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white border-slate-200/70 rounded-xl border">
                                        <span className="font-bold text-quaternary tracking-wider block text-[10px] uppercase">
                                            Country
                                        </span>
                                        <span className="text-xs font-semibold sm:text-sm text-slate-800">
                                            {hotel.locations?.countryName ||
                                                hotel.countryCode ||
                                                '-'}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white border-slate-200/70 rounded-xl sm:col-span-1 col-span-2 border">
                                        <span className="font-bold text-quaternary tracking-wider block text-[10px] uppercase">
                                            Hotel Code
                                        </span>
                                        <span className="font-mono text-xs font-semibold sm:text-sm text-slate-800">
                                            {hotel.hotelCode || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-gray-100 text-xs text-quaternary flex shrink-0 items-center justify-between border-t">
                        <span>
                            {hotel.name} • {hotel.locations?.cityName || ''}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-1.5 rounded-xl font-bold cursor-pointer border transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}
