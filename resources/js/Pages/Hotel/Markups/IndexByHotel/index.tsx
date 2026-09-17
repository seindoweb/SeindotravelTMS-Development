import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronRight } from 'lucide-react';

export default function index() {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Hotel
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Markups
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Hotel
                    </span>
                </>
            }
        >
            <Head title="Hotel Markup" />
        </AuthenticatedLayout>
    );
}
