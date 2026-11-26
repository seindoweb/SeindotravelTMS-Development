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
    Images,
    MapPin,
    Sparkles,
    Star,
    Utensils,
    Waves,
    Wifi,
    Wind,
    Wine,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import HotelDetailModal from './HotelDetailModal';

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

export default function HotelHeader({
    hotel,
    nights,
}: {
    hotel: HotelDetailInfo;
    nights: number;
}) {
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
                const moreImages =
                    r.roomInformations?.moreInformations?.photo?.image;
                if (Array.isArray(moreImages)) {
                    moreImages.forEach((img) => addPhoto(img?.url));
                }
            });
        }

        return photoList;
    }, [hotel]);

    const facilitiesList = useMemo(() => {
        const list = (hotel.facilities || [])
            .map((f) => f.type?.trim() || f.name?.trim())
            .filter(Boolean);
        return Array.from(new Set(list));
    }, [hotel.facilities]);

    const highlightFacilities = facilitiesList.slice(0, 5);

    const locationDisplay = hotel.locations?.area
        ? `${hotel.locations.area}, ${hotel.locations.cityName || ''}`
        : hotel.locations?.addressMain || hotel.locations?.cityName || '';

    return (
        <>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 border border-[#E2E8F0]">
                <div className="gap-4 md:flex-row md:items-start flex flex-col justify-between">
                    <div className="space-y-1.5 flex-1">
                        <div className="gap-2 flex flex-wrap items-center">
                            <span className="gap-1 font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md inline-flex items-center text-[11px]">
                                <Building2 size={12} />
                                Hotel
                            </span>

                            {ratingNum > 0 && (
                                <div className="gap-1 bg-amber-50 text-amber-900 border-amber-200/70 px-2 py-0.5 rounded-md font-bold inline-flex items-center border text-[11px]">
                                    <div className="flex items-center">
                                        {Array.from({
                                            length: Math.min(5, ratingNum),
                                        }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={11}
                                                className="fill-amber-400 text-amber-500"
                                            />
                                        ))}
                                    </div>
                                    {/* <span className="ml-0.5">Bintang {ratingNum}</span> */}
                                </div>
                            )}

                            {nights > 0 && (
                                <span className="gap-1 font-semibold text-quaternary bg-slate-100 border-slate-200/60 px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px]">
                                    <Calendar size={11} />
                                    {nights} Nights
                                </span>
                            )}
                        </div>

                        <h1 className="text-xl font-black leading-tight tracking-tight sm:text-2xl md:text-3xl text-primary">
                            {hotel.name}
                        </h1>

                        <div className="gap-2 text-xs text-quaternary flex flex-wrap items-center">
                            <div className="gap-1 flex items-center">
                                <MapPin
                                    size={13}
                                    className="text-primary shrink-0"
                                />
                                <span className="font-medium line-clamp-1">
                                    {locationDisplay}
                                </span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(true)}
                                className="font-semibold text-primary hover:text-primary-bright cursor-pointer hover:underline"
                            >
                                View Full Address
                            </button>
                        </div>
                    </div>

                    <div className="shrink-0 self-start">
                        <button
                            type="button"
                            onClick={() => setShowDetailModal(true)}
                            className="gap-1.5 bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-primary font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-xs inline-flex cursor-pointer items-center border transition-all active:scale-[0.98]"
                        >
                            <span>View Hotel Detail</span>
                        </button>
                    </div>
                </div>

                {allPhotos.length === 0 ? (
                    <div className="gap-2 text-gray-400 h-52 sm:h-64 rounded-2xl bg-slate-50 border-slate-200 flex w-full flex-col items-center justify-center border border-dashed">
                        <Building2 size={36} className="text-gray-300" />
                        <span className="text-xs font-medium">
                            Hotel photos not available
                        </span>
                    </div>
                ) : allPhotos.length === 1 ? (
                    <div
                        onClick={() => setLightboxIndex(0)}
                        className="h-64 bg-gray-100 border-gray-100 sm:h-80 md:h-96 rounded-2xl group shadow-2xs relative w-full cursor-pointer overflow-hidden border"
                    >
                        <img
                            src={allPhotos[0].url}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="eager"
                        />
                        <span className="bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 gap-1.5 shadow-sm absolute flex items-center rounded-full">
                            <Images size={13} />
                            View Photos
                        </span>
                    </div>
                ) : allPhotos.length === 2 ? (
                    <div className="h-64 gap-3 sm:grid-cols-2 sm:h-80 rounded-2xl grid grid-cols-1 overflow-hidden">
                        {allPhotos.slice(0, 2).map((photo, idx) => (
                            <div
                                key={idx}
                                onClick={() => setLightboxIndex(idx)}
                                className="bg-gray-100 rounded-2xl group shadow-2xs relative h-full cursor-pointer overflow-hidden"
                            >
                                <img
                                    src={photo.url}
                                    alt={`${hotel.name} foto ${idx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {idx === 1 && (
                                    <span className="bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 gap-1.5 shadow-sm absolute flex items-center rounded-full">
                                        <Images size={13} />
                                        View All Photos (2)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="gap-3 md:grid-cols-3 rounded-2xl grid h-full grid-cols-1 overflow-hidden">
                        <div
                            onClick={() => setLightboxIndex(0)}
                            className="bg-gray-100 md:col-span-2 rounded-2xl group shadow-2xs relative h-full cursor-pointer overflow-hidden"
                        >
                            <img
                                src={allPhotos[0].url}
                                alt={hotel.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="eager"
                            />
                            <div className="inset-0 p-4 from-black/40 absolute flex items-end bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-xs font-bold text-white drop-shadow-sm">
                                    Click to Enlarge
                                </span>
                            </div>
                        </div>

                        <div className="gap-3 md:grid-cols-1 h-28 sm:h-36 md:h-full grid grid-cols-2">
                            <div
                                onClick={() => setLightboxIndex(1)}
                                className="bg-gray-100 rounded-2xl group shadow-2xs relative h-full cursor-pointer overflow-hidden"
                            >
                                <img
                                    src={allPhotos[1].url}
                                    alt={`${hotel.name} foto 2`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div
                                onClick={() => setLightboxIndex(2)}
                                className="bg-gray-100 rounded-2xl group shadow-2xs relative h-full cursor-pointer overflow-hidden"
                            >
                                <img
                                    src={allPhotos[2].url}
                                    alt={`${hotel.name} foto 3`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                <div className="inset-0 p-2 bg-black/40 hover:bg-black/50 backdrop-blur-2xs absolute flex items-center justify-center text-center transition-colors">
                                    <div className="gap-1 text-white flex flex-col items-center">
                                        <Images
                                            size={20}
                                            className="drop-shadow-sm"
                                        />
                                        <span className="text-xs font-black tracking-tight sm:text-sm drop-shadow-sm">
                                            {allPhotos.length > 3
                                                ? `+${allPhotos.length - 3} Other Photos`
                                                : 'View All Photos'}
                                        </span>
                                        <span className="text-white/80 sm:block hidden text-[10px]">
                                            Total {allPhotos.length} Photos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="gap-3 pt-2 border-gray-100 sm:flex-row sm:items-center flex flex-col justify-between border-t">
                    <div className="gap-2 flex flex-wrap items-center">
                        <span className="mr-1 text-xs font-bold text-quaternary sm:inline hidden">
                            Populer Facilities:
                        </span>
                        {highlightFacilities.map((chip, idx) => {
                            const IconComp = getFacilityIcon(chip);
                            return (
                                <span
                                    key={idx}
                                    className="gap-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border-slate-200/70 px-3 py-1.5 rounded-xl shadow-2xs hover:border-slate-300 inline-flex items-center border transition-colors"
                                >
                                    <IconComp
                                        size={13}
                                        className="text-primary"
                                    />
                                    <span>{chip}</span>
                                </span>
                            );
                        })}

                        {facilitiesList.length > highlightFacilities.length && (
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(true)}
                                className="gap-1 px-2 py-1 text-xs font-bold rounded-lg text-primary hover:text-primary-bright hover:bg-primary/5 inline-flex cursor-pointer items-center transition-colors"
                            >
                                View{' '}
                                <span>
                                    +
                                    {facilitiesList.length -
                                        highlightFacilities.length}{' '}
                                    Other Facilities
                                </span>
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
