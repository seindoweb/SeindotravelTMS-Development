import { Badge } from '@/Components/Badge';
import Modal from '@/Components/Modal';
import { formatDate, formatNumber } from '@/helpers';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { MarkupHotelProps } from '@/types';
import { Calendar, Clock, Info, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type MarkUpDetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    markupKey: string | number | null;
    title?: string;
};

export default function MarkUpDetailModal({ isOpen, onClose, markupKey, title = "Markup Details" }: MarkUpDetailModalProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<MarkupHotelProps | null>(null);

    useEffect(() => {
        if (isOpen && markupKey !== null) {
            fetchDetail();
        }
    }, [isOpen, markupKey]);

    const fetchDetail = async () => {
        setLoading(true);
        setData(null);
        try {
            const res = await hotelMicroserviceApi.post('/markup-rule/detail', {
                key: markupKey
            });
            if (res.data?.data) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch markup detail:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">
                                    Type: <span className="text-primary">{data.scopeType == "htl" ? "Hotel" : "Destination"}</span>
                                </p>
                            </div>
                            <Badge type={data.isActive || (data as any)['isActive '] ? 'success' : 'danger'}>
                                {data.isActive || (data as any)['isActive '] ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Markup Info</p>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium text-gray-500">Type: </span>
                                                <span className="capitalize font-semibold">{data.markupType}</span>
                                            </p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                <span className="font-medium text-gray-500">Value: </span>
                                                <span className="font-bold text-primary">
                                                    {data.markupType === 'fixed' ? formatNumber(data.markupValue) : `${data.markupValue}%`}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Validity Period</p>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium text-gray-500">From: </span>
                                                {formatDate(data.validFrom)}
                                            </p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                <span className="font-medium text-gray-500">Until: </span>
                                                {formatDate(data.validUntil)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Audit Trail</p>
                                            <div className="mt-1 space-y-1">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium text-gray-500">Created by: </span>
                                                    {data.createdByEmail || '-'}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium text-gray-500">Updated by: </span>
                                                    {data.updatedByEmail || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Timestamps</p>
                                            <div className="mt-1 space-y-1">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium text-gray-500">Created at: </span>
                                                    {formatDate(data.createdAt)}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium text-gray-500">Updated at: </span>
                                                    {formatDate(data.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {data.description && (
                                <div className="md:col-span-2 mt-2">
                                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Description</p>
                                        <p className="text-sm text-gray-700">{data.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                        <p>Failed to load data or not found.</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                    onClick={onClose}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}
