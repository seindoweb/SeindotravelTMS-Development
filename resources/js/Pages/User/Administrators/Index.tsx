import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react'
import { ChevronRight } from 'lucide-react';

export default function Index() {
  return (
    <AuthenticatedLayout
        header={
            <>
                <span className="text-sm font-bold truncate text-primary">
                    Users
                </span>
                <ChevronRight
                    size={14}
                    className="hidden text-[#CBD5E1] sm:block"
                />
                <span className="text-sm font-bold truncate text-primary">
                    Administrators
                </span>
            </>
        }>

        <Head title="Administrators" />
        <div>Index</div>

    </AuthenticatedLayout>
  )
}
