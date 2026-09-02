import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronRight } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
     const user = usePage().props.auth.user;
  return (
    <AuthenticatedLayout
        header={
            <>
                <span className="text-sm font-bold truncate text-primary">
                    Profile
                </span>
            </>
        }>

        <Head title="Profile" />
        {/* <ListCustomerTable /> */}

    </AuthenticatedLayout>
  )
}
