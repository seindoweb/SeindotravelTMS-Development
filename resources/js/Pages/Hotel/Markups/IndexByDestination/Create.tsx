import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import CreateMarkUpDestinationForm from './Partials/CreateMarkUpDestinationForm';

export default function Create() {
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
                        Destination
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Create
                    </span>
                </>
            }
        >
            <Head title="Destination Markup" />
            <CreateMarkUpDestinationForm/>
        </AuthenticatedLayout>
    );
}
