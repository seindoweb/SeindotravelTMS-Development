import PhotoLightbox from "@/Components/PhotoLightBox";
import { HotelDetailInfo, HotelRoomDetail } from "@/types";
import { AlertCircle, BedDouble, Check, Cigarette, CigaretteOff, Coffee, Copy, ImageOff, Maximize2, Ruler, Shirt, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function RoomDetailModal({
    room,
    hotel,
    nights,
    onClose,
}: {
    room: HotelRoomDetail;
    hotel: HotelDetailInfo;
    nights: number;
    onClose: () => void;
}) {
    const info = room.roomInformations;
    const more = info?.moreInformations;
    const photos = more?.photo?.image ?? [];
    const allPhotos = info?.thumbnail
        ? [{ url: info.thumbnail, isMain: true }, ...photos.filter((p) => p.url !== info.thumbnail)]
        : photos;

    const [activePhoto, setActivePhoto] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [imgError, setImgError] = useState(false);
    const [copiedPrice, setCopiedPrice] = useState(false);
    const markup = room.sellingPrice - room.ntaPrice;
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCopyPrice = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const priceText = `${(hotel.currency || 'IDR').trim()} ${formatRupiah(room.sellingPrice).trim()}`.replace(/\s+/g, ' ').trim();
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

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose(); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const formatRupiah = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
            .format(num)
            .replace('Rp', '');
    };

    const formatPolicyDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                return new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            }
        } catch {
            // fallback
        }
        return dateStr;
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
                <div
                    ref={scrollRef}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
                    >
                        <X size={18} />
                    </button>

                    <div className="relative w-full h-56 sm:h-72 bg-gray-100 overflow-hidden rounded-t-2xl">
                        {allPhotos.length > 0 && !imgError ? (
                            <img
                                key={allPhotos[activePhoto]?.url}
                                src={allPhotos[activePhoto]?.url}
                                alt={room.name}
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover transition-all duration-300"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
                                <ImageOff size={40} />
                                <span className="mt-2 text-xs">No Image</span>
                            </div>
                        )}

                        {allPhotos.length > 0 && !imgError && (
                            <button
                                onClick={() => setLightboxIndex(activePhoto)}
                                className="absolute top-3 left-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
                            >
                                <Maximize2 size={15} />
                            </button>
                        )}

                        {allPhotos.length > 1 && (
                            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {activePhoto + 1}/{allPhotos.length}
                            </span>
                        )}
                    </div>

                    {allPhotos.length > 1 && (
                        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100">
                            {allPhotos.map((ph, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setActivePhoto(idx); setImgError(false); }}
                                    className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                                        activePhoto === idx
                                            ? 'border-primary ring-2 ring-primary/20 scale-105'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={ph.url}
                                        alt={`thumb-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="px-5 pt-4 pb-6 space-y-5">
                        <div>
                            <div className="flex items-start gap-2">
                                <BedDouble size={20} className="text-primary mt-0.5 shrink-0" />
                                <h2 className="text-xl font-black text-primary leading-tight">
                                    {room.name}
                                </h2>
                            </div>
                            {room.mealPlanName && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Coffee size={13} className="text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-700">
                                        {room.mealPlanName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {room.message && room.message.trim() !== '' && (
                            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900">
                                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                <div className="leading-relaxed">
                                    <span className="font-bold text-amber-900 block mb-0.5">Important Notes:</span>
                                    <p className="text-amber-800 whitespace-pre-line">{room.message}</p>
                                </div>
                            </div>
                        )}

                        {more && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {more.roomSize && (
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2.5">
                                        <Ruler size={15} className="text-primary shrink-0" />
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Size</span>
                                            <span className="text-sm font-bold text-gray-700">{more.roomSize}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2.5">
                                    <Users size={15} className="text-primary shrink-0" />
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Capacity</span>
                                        <span className="text-sm font-bold text-gray-700">
                                            {more.maxAdults} Adults{more.maxChildren > 0 ? `, ${more.maxChildren} Children` : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2.5">
                                    {more.isSmokingAllowed ? (
                                        <Cigarette size={15} className="text-amber-500 shrink-0" />
                                    ) : (
                                        <CigaretteOff size={15} className="text-emerald-600 shrink-0" />
                                    )}
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Cigarette</span>
                                        <span className={`text-sm font-bold ${more.isSmokingAllowed ? 'text-amber-600' : 'text-emerald-700'}`}>
                                            {more.isSmokingAllowed ? 'Allowed' : 'Forbidden'}
                                        </span>
                                    </div>
                                </div>
                                {room.extraBedAllowed && (
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2.5">
                                        <Shirt size={15} className="text-primary shrink-0" />
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Extra Bed</span>
                                            <span className="text-sm font-bold text-gray-700">Available</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {more?.roomDescription?.content && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                   Room Description
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {more.roomDescription.content}
                                </p>
                            </div>
                        )}

                        {more?.amenities?.amenitiesTypeList && more.amenities.amenitiesTypeList.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Room Facilities
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {more.amenities.amenitiesTypeList.map((a, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/5 text-primary border border-primary/15 px-2.5 py-0.5 rounded-full"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {room.cancellationPolicies && room.cancellationPolicies.length > 0 && (
                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                  Cancellation Policies
                                </h4>
                                </div>

                                <div className="space-y-3.5 pl-1">
                                    {room.cancellationPolicies.map((policy, idx) => {
                                        const penalty = parseFloat(String(policy.percent ?? policy.value ?? 0)) || 0;
                                        const isFree = penalty === 0 || policy.type === 'freeCancellation';

                                        return (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                                            isFree
                                                                ? 'bg-emerald-500 ring-4 ring-emerald-100'
                                                                : 'bg-rose-500 ring-4 ring-rose-100'
                                                        }`}
                                                    />
                                                    <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                                                        {formatPolicyDate(policy.fromDate)} – {formatPolicyDate(policy.toDate)}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-1.5 pl-4 sm:pl-5 text-xs">
                                                    <span className="text-slate-400 font-mono select-none">└</span>
                                                    <span
                                                        className={
                                                            isFree
                                                                ? 'text-emerald-700 font-medium'
                                                                : 'text-slate-600'
                                                        }
                                                    >
                                                        {isFree
                                                            ? 'Pembatalan gratis. Belum ada biaya penalti.'
                                                            : `Penalti pembatalan sebesar ${penalty}% dari total harga.`}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {room.remarks && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800 italic">
                                {room.remarks}
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl px-5 py-4">
                            <div className="flex items-end justify-between gap-3 flex-wrap">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                                        Total {nights} nights
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span
                                            onClick={handleCopyPrice}
                                            title="Click to copy price"
                                            className="text-2xl font-black text-primary cursor-pointer hover:text-primary-bright transition-colors select-all"
                                        >
                                            {hotel.currency}{formatRupiah(room.sellingPrice)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleCopyPrice}
                                            title={copiedPrice ? 'Price copied successfully!' : 'Copy price'}
                                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                                                copiedPrice
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 scale-105'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-primary'
                                            }`}
                                        >
                                            {copiedPrice ? (
                                                <>
                                                    <Check size={11} className="text-emerald-600 stroke-[2.5]" />
                                                    <span className="text-[10px]">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={11} className="text-gray-400 group-hover:text-primary" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-0.5 block">
                                        {hotel.currency}{formatRupiah(room.sellingPricePerNight)} / night base price
                                    </span>
                                </div>
                                {markup > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap">
                                        <TrendingUp size={11} className="text-emerald-600" />
                                        Markup: {hotel.currency}{formatRupiah(markup)}
                                    </span>
                                )}
                            </div>
                        </div>
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
        </>
    );
}