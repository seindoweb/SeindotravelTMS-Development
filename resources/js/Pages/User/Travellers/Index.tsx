import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import ListTravellerTable from './Partials/ListTravellerTable';

export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Users
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Traveller
                    </span>
                </>
            }
        >
            <Head title="Traveller" />
            <ListTravellerTable />
        </AuthenticatedLayout>
    );
}
