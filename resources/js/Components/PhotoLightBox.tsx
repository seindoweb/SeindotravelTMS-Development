import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PhotoLightbox({
    photos,
    initialIndex,
    onClose,
}: {
    photos: { url: string; isMain: boolean }[];
    initialIndex: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState(initialIndex);

    const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
    const next = () => setCurrent((c) => (c + 1) % photos.length);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') { prev(); }
            if (e.key === 'ArrowRight') { next(); }
            if (e.key === 'Escape') { onClose(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={onClose}
            >
                <X size={22} />
            </button>

            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={(e) => { e.stopPropagation(); prev(); }}
            >
                <ChevronLeft size={24} />
            </button>

            <img
                src={photos[current].url}
                alt={`Photo ${current + 1}`}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />

            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={(e) => { e.stopPropagation(); next(); }}
            >
                <ChevronRight size={24} />
            </button>

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                {current + 1} / {photos.length}
            </span>
        </div>
    );
}