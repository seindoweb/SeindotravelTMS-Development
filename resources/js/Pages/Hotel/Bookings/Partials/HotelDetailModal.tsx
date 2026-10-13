import PhotoLightbox from '@/Components/PhotoLightBox';
import { HotelDetailInfo } from '@/types';
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
    if (lower.includes('pool') || lower.includes('kolam') || lower.includes('renang')) return Waves;
    if (lower.includes('restoran') || lower.includes('restaurant') || lower.includes('dining') || lower.includes('makan') || lower.includes('breakfast') || lower.includes('cafe')) return Utensils;
    if (lower.includes('parkir') || lower.includes('parking')) return Car;
    if (lower.includes('ac') || lower.includes('air condition')) return Wind;
    if (lower.includes('24') || lower.includes('resepsionis') || lower.includes('front desk')) return Clock;
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('spa') || lower.includes('massage')) return Sparkles;
    if (lower.includes('bar') || lower.includes('lounge')) return Wine;
    if (lower.includes('smoking') || lower.includes('rokok')) return Cigarette;
    if (lower.includes('lift') || lower.includes('elevator')) return ArrowUpDown;
    return CheckCircle2;
};

export default function HotelDetailModal({
    hotel,
    photos,
    nights,
    onClose,
}: HotelDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'facilities' | 'photos' | 'location'>('facilities');
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

        let existing = acc.find((g) => g.category.toLowerCase() === category.toLowerCase());
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
        `${hotel.name} ${hotel.locations?.cityName || ''} ${hotel.locations?.countryName || ''}`
    )}`;

    return (
        <>
            <div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-none">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
                        <div className="space-y-1 pr-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                    <Building2 size={12} />
                                    Accommodation
                                </span>
                                {ratingNum > 0 && (
                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold">
                                        <Star size={11} className="fill-amber-400 text-amber-500" />
                                        <span>Star {ratingNum}</span>
                                    </div>
                                )}
                                {nights && nights > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-quaternary bg-slate-100 px-2 py-0.5 rounded-md">
                                        <Calendar size={11} />
                                        {nights} Nights
                                    </span>
                                )}
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-primary leading-tight">
                                {hotel.name}
                            </h2>

                            <div className="flex items-center gap-1.5 text-xs text-quaternary">
                                <MapPin size={13} className="text-primary shrink-0" />
                                <span className="line-clamp-1">{fullAddress || hotel.locations?.cityName || 'Hotel Location'}</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                            aria-label="Tutup"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex border-b border-gray-100 px-5 sm:px-6 gap-2 sm:gap-4 bg-slate-50/60 shrink-0">
                        <button
                            onClick={() => setActiveTab('facilities')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'facilities'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Sparkles size={14} />
                            Facilities ({groupedFacilities.length} Categories)
                        </button>
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'photos'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Images size={14} />
                            All Photos ({photos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('location')}
                            className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'location'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <MapPin size={14} />
                            Location & Address
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                        {activeTab === 'facilities' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                           Facilities by Category
                                        </h3>
                                        <p className="text-xs text-quaternary mt-0.5">
                                           Details of facilities and services based on category type
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
                                        {groupedFacilities.length} Categories
                                    </span>
                                </div>

                                {groupedFacilities.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {groupedFacilities.map((group, idx) => {
                                            const IconComp = getFacilityIcon(group.category);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 text-primary shadow-2xs">
                                                                <IconComp size={16} />
                                                            </div>
                                                            <h4 className="font-bold text-sm text-slate-800">
                                                                {group.category}
                                                            </h4>
                                                        </div>
                                                        <span className="text-[11px] font-medium text-quaternary bg-white border border-slate-200/60 px-2 py-0.5 rounded-md shrink-0">
                                                            {group.items.length} info
                                                        </span>
                                                    </div>

                                                    <ul className="space-y-2 flex-1">
                                                        {group.items.map((item, itemIdx) => (
                                                            <li
                                                                key={itemIdx}
                                                                className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
                                                            >
                                                                <CheckCircle2
                                                                    size={13}
                                                                    className="text-emerald-600 mt-0.5 shrink-0"
                                                                />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-quaternary text-xs">
                                        No detailed facility information has been provided by the property.
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
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                        {photos.map((photo, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={`${hotel.name} foto ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-xs transition-opacity">
                                                        Enlarge
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 text-quaternary text-xs">
                                        No photos are available for this hotel.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="space-y-4">
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-slate-800">
                                            Property Address
                                            </h4>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {fullAddress || 'Address Not Available'}
                                            </p>
                                        </div>
                                    </div>

                                    {hotel.locations?.landmark && (
                                        <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                                            <span className="font-semibold text-slate-800">Nearby Landmark: </span>
                                            {hotel.locations.landmark}
                                        </div>
                                    )}

                                    <div className="pt-3">
                                        <a
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-bright text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                                        >
                                            <ExternalLink size={13} />
                                            <span>Open in Google Maps</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="bg-white border border-slate-200/70 rounded-xl p-3">
                                        <span className="block text-[10px] uppercase font-bold text-quaternary tracking-wider">
                                            City
                                        </span>
                                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                            {hotel.locations?.cityName || '-'}
                                        </span>
                                    </div>
                                    <div className="bg-white border border-slate-200/70 rounded-xl p-3">
                                        <span className="block text-[10px] uppercase font-bold text-quaternary tracking-wider">
                                            Country
                                        </span>
                                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                            {hotel.locations?.countryName || hotel.countryCode || '-'}
                                        </span>
                                    </div>
                                    <div className="bg-white border border-slate-200/70 rounded-xl p-3 col-span-2 sm:col-span-1">
                                        <span className="block text-[10px] uppercase font-bold text-quaternary tracking-wider">
                                            Hotel Code
                                        </span>
                                        <span className="text-xs sm:text-sm font-mono font-semibold text-slate-800">
                                            {hotel.hotelCode || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-quaternary shrink-0">
                        <span>
                            {hotel.name} • {hotel.locations?.cityName || ''}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
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
