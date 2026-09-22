import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { MarkupDestinationProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditMarkUpDestinationForm from './Partials/EditMarkUpDestinationForm';

type EditProps = {
    markupKey: number;
};

export default function Edit({ markupKey }: EditProps) {
    const [markupDestination, setMarkupDestination] = useState<MarkupDestinationProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await hotelMicroserviceApi.post('/markup-rule/detail', {
                    key: markupKey,
                });
                if (res.data?.data) {
                    setMarkupDestination(res.data.data);
                } else {
                    setError('Data not found.');
                }
            } catch (err) {
                console.error('Failed to fetch markup detail:', err);
                setError('Failed to load markup data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [markupKey]);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">Hotel</span>
                    <ChevronRight size={14} className="sm:block hidden text-[#CBD5E1]" />
                    <span className="text-sm font-bold text-primary truncate">Markups</span>
                    <ChevronRight size={14} className="sm:block hidden text-[#CBD5E1]" />
                    <span className="text-sm font-bold text-primary truncate">Destination</span>
                    <ChevronRight size={14} className="sm:block hidden text-[#CBD5E1]" />
                    <span className="text-sm font-bold text-primary truncate">Edit</span>
                </>
            }
        >
            <Head title="Hotel Markup — Edit" />

            {loading ? (
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-gray-100 mt-6 flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : error ? (
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-gray-100 mt-6 flex items-center justify-center h-64">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            ) : markupDestination ? (
                <EditMarkUpDestinationForm initialData={markupDestination} />
            ) : null}
        </AuthenticatedLayout>
    );
}
