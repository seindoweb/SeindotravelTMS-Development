import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function List() {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Hotels
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Orders
                    </span>
                </>
            }
        >
            <Head title="Hotel Orders" />
            {/* <ListCustomerTable /> */}
        </AuthenticatedLayout>
    );
}
