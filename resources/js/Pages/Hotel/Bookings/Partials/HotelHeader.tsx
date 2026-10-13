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
    Images,
    MapPin,
    Sparkles,
    Star,
    Utensils,
    Waves,
    Wifi,
    Wind,
    Wine
} from 'lucide-react';
import { useMemo, useState } from 'react';
import HotelDetailModal from './HotelDetailModal';

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

export default function HotelHeader({ hotel, nights }: { hotel: HotelDetailInfo; nights: number }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const ratingNum = parseInt(hotel.rating, 10) || 0;

    const allPhotos = useMemo(() => {
        const photoList: { url: string; isMain: boolean }[] = [];
        const seen = new Set<string>();

        const addPhoto = (url?: string, isMain = false) => {
            if (!url || seen.has(url)) return;
            seen.add(url);
            photoList.push({ url, isMain });
        };

        if (hotel.thumbnail) {
            addPhoto(hotel.thumbnail, true);
        }

        if (Array.isArray(hotel.images)) {
            hotel.images.forEach((img) => {
                const url = typeof img === 'string' ? img : img?.url;
                addPhoto(url);
            });
        }

        if (Array.isArray(hotel.roomDetails)) {
            hotel.roomDetails.forEach((r) => {
                addPhoto(r.roomInformations?.thumbnail);
                const moreImages = r.roomInformations?.moreInformations?.photo?.image;
                if (Array.isArray(moreImages)) {
                    moreImages.forEach((img) => addPhoto(img?.url));
                }
            });
        }

        return photoList;
    }, [hotel]);

    const facilitiesList = useMemo(() => {
        const list = (hotel.facilities || []).map((f) => f.type?.trim() || f.name?.trim()).filter(Boolean);
        return Array.from(new Set(list));
    }, [hotel.facilities]);

    const highlightFacilities = facilitiesList.slice(0, 5);

    const locationDisplay = hotel.locations?.area
        ? `${hotel.locations.area}, ${hotel.locations.cityName || ''}`
        : hotel.locations?.addressMain || hotel.locations?.cityName || '';

    return (
        <>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                                <Building2 size={12} />
                                Hotel
                            </span>

                            {ratingNum > 0 && (
                                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-0.5 rounded-md text-[11px] font-bold">
                                    <div className="flex items-center">
                                        {Array.from({ length: Math.min(5, ratingNum) }).map((_, i) => (
                                            <Star key={i} size={11} className="fill-amber-400 text-amber-500" />
                                        ))}
                                    </div>
                                    {/* <span className="ml-0.5">Bintang {ratingNum}</span> */}
                                </div>
                            )}

                            {nights > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-quaternary bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                                    <Calendar size={11} />
                                    {nights} Nights
                                </span>
                            )}
                        </div>

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-primary leading-tight tracking-tight">
                            {hotel.name}
                        </h1>

                        <div className="flex items-center gap-2 text-xs text-quaternary flex-wrap">
                            <div className="flex items-center gap-1">
                                <MapPin size={13} className="text-primary shrink-0" />
                                <span className="line-clamp-1 font-medium">{locationDisplay}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(true)}
                                className="text-primary hover:text-primary-bright font-semibold hover:underline cursor-pointer"
                            >
                               View Full Address
                            </button>
                        </div>
                    </div>

                    <div className="shrink-0 self-start">
                        <button
                            type="button"
                            onClick={() => setShowDetailModal(true)}
                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-primary font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer"
                        >
                            <span>View Hotel Detail</span>
                        </button>
                    </div>
                </div>

                {allPhotos.length === 0 ? (
                    <div className="w-full h-52 sm:h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Building2 size={36} className="text-gray-300" />
                        <span className="text-xs font-medium">Hotel photos not available</span>
                    </div>
                ) : allPhotos.length === 1 ? (
                    <div
                        onClick={() => setLightboxIndex(0)}
                        className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer group shadow-2xs"
                    >
                        <img
                            src={allPhotos[0].url}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="eager"
                        />
                        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <Images size={13} />
                            View Photos
                        </span>
                    </div>
                ) : allPhotos.length === 2 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-64 sm:h-80 rounded-2xl overflow-hidden">
                        {allPhotos.slice(0, 2).map((photo, idx) => (
                            <div
                                key={idx}
                                onClick={() => setLightboxIndex(idx)}
                                className="relative h-full overflow-hidden rounded-2xl bg-gray-100 cursor-pointer group shadow-2xs"
                            >
                                <img
                                    src={photo.url}
                                    alt={`${hotel.name} foto ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {idx === 1 && (
                                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Images size={13} />
                                        View All Photos (2)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
                        <div
                            onClick={() => setLightboxIndex(0)}
                            className="relative md:col-span-2 h-52 sm:h-64 md:h-full rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group shadow-2xs"
                        >
                            <img
                                src={allPhotos[0].url}
                                alt={hotel.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-white text-xs font-bold drop-shadow-sm">
                                    Click to Enlarge
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 h-28 sm:h-36 md:h-full">
                            <div
                                onClick={() => setLightboxIndex(1)}
                                className="relative h-full rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group shadow-2xs"
                            >
                                <img
                                    src={allPhotos[1].url}
                                    alt={`${hotel.name} foto 2`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div
                                onClick={() => setLightboxIndex(2)}
                                className="relative h-full rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group shadow-2xs"
                            >
                                <img
                                    src={allPhotos[2].url}
                                    alt={`${hotel.name} foto 3`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center p-2 text-center backdrop-blur-2xs">
                                    <div className="flex flex-col items-center gap-1 text-white">
                                        <Images size={20} className="drop-shadow-sm" />
                                        <span className="text-xs sm:text-sm font-black tracking-tight drop-shadow-sm">
                                            {allPhotos.length > 3
                                                ? `+${allPhotos.length - 3} Other Photos`
                                                : 'View All Photos'}
                                        </span>
                                        <span className="text-[10px] text-white/80 hidden sm:block">
                                            Total {allPhotos.length} Photos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-quaternary mr-1 hidden sm:inline">
                            Populer Facilities:
                        </span>
                        {highlightFacilities.map((chip, idx) => {
                            const IconComp = getFacilityIcon(chip);
                            return (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/70 px-3 py-1.5 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                                >
                                    <IconComp size={13} className="text-primary" />
                                    <span>{chip}</span>
                                </span>
                            );
                        })}

                        {facilitiesList.length > highlightFacilities.length && (
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(true)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-bright px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                                <Sparkles size={12} />
                                <span>+{facilitiesList.length - highlightFacilities.length} Other Facilities</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={allPhotos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}

            {showDetailModal && (
                <HotelDetailModal
                    hotel={hotel}
                    photos={allPhotos}
                    nights={nights}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </>
    );
}
