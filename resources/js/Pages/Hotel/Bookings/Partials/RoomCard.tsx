import { HotelRoomDetail } from '@/types';
import {
    AlertCircle,
    BedDouble,
    Check,
    CheckCircle2,
    Cigarette,
    CigaretteOff,
    Coffee,
    Copy,
    ShieldCheck,
    TrendingUp,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import RoomDetailModal from './RoomDetailModal';

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

export default function RoomCard({ room, hotel, nights }: { room: HotelRoomDetail; hotel: any; nights: number }) {
    const markup = room.sellingPrice - room.ntaPrice;
    const isRefundable = room.refundable;
    const [imgError, setImgError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [copiedPrice, setCopiedPrice] = useState(false);

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

    const thumbnail = room.roomInformations?.thumbnail;
    const more = room.roomInformations?.moreInformations;

    return (
        <>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-gray-300 transition-all duration-200">
                {thumbnail && !imgError ? (
                    <div className="relative w-full sm:w-44 h-44 sm:h-auto shrink-0 bg-gray-100 overflow-hidden">
                        <img
                            src={thumbnail}
                            alt={room.name}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {(more?.photo?.image?.length ?? 0) > 0 && (
                            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                +{more!.photo!.image.length} photos
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full sm:w-44 h-28 sm:h-auto shrink-0 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100">
                        <BedDouble size={36} className="text-gray-300" />
                    </div>
                )}

                <div className="flex flex-1 flex-col sm:flex-row gap-4 p-4 sm:p-5">
                    <div className="flex flex-1 flex-col justify-between space-y-3">
                        <div>
                            <div className="flex items-start gap-2">
                                <BedDouble size={17} className="text-primary mt-0.5 shrink-0" />
                                <h3 className="text-base font-bold text-primary leading-snug">
                                    {room.name}
                                </h3>
                            </div>
                            {room.mealPlanName && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Coffee size={12} className="text-emerald-600" />
                                    <span className="text-xs font-medium text-emerald-700">
                                        {room.mealPlanName}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                                    isRefundable
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                        : 'bg-red-50 text-red-600 border-red-200/60'
                                }`}
                            >
                                {isRefundable ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                {isRefundable ? 'Refundable' : 'Non-Refundable'}
                            </span>

                            {(more?.maxOccupancy ?? room.maxOccupancy) > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-quaternary border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                                    <ShieldCheck size={11} className="text-primary" />
                                    Max {more?.maxOccupancy ?? room.maxOccupancy} guests
                                </span>
                            )}

                            {more?.roomSize && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-quaternary border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                                    {more.roomSize}
                                </span>
                            )}

                            {room.extraBedAllowed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-quaternary border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                                    + Extra Bed
                                </span>
                            )}

                            {more && (
                                <span
                                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                                        more.isSmokingAllowed
                                            ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                            : 'bg-slate-50 text-quaternary border-slate-200/60'
                                    }`}
                                >
                                    {more.isSmokingAllowed ? <Cigarette size={11} /> : <CigaretteOff size={11} />}
                                    {more.isSmokingAllowed ? 'Smoking' : 'Non-Smoking'}
                                </span>
                            )}
                        </div>

                        {room.message && room.message.trim() !== '' && (
                            <div className="flex items-start gap-2 bg-amber-50/90 border border-amber-200/80 rounded-xl px-3 py-2 text-xs text-amber-900">
                                <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                <div className="leading-snug">
                                    <span className="font-bold text-amber-900 mr-1.5">Notes:</span>
                                    <span className="text-amber-800 line-clamp-2">{room.message}</span>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-bright hover:underline transition-colors cursor-pointer"
                        >
                            View Room Detail
                        </button>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-3 sm:min-w-[180px]">
                        <div className="text-right w-full sm:w-auto">
                            <div className="flex items-center justify-end gap-1.5">
                                <span
                                    onClick={handleCopyPrice}
                                    title="Click to copy price"
                                    className="text-xl font-black sm:text-2xl text-primary cursor-pointer hover:text-primary-bright transition-colors select-all"
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
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-primary'
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

                            <div className="flex flex-col items-end gap-1 mt-1.5">
                                <span className="text-xs font-medium text-quaternary">
                                    Base: {hotel.currency}{formatRupiah(room.ntaPrice)}/night
                                </span>
                                {markup > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                        <TrendingUp size={11} className="text-emerald-600" />
                                        Markup: {hotel.currency}{formatRupiah(markup)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="bg-primary hover:bg-primary-bright text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                        >
                            <span>Book Room</span>
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <RoomDetailModal
                    room={room}
                    hotel={hotel}
                    nights={nights}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
