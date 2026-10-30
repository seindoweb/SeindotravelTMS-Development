import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import EditTravellerForm, {
    TravellerDetail,
} from './Partials/EditTravellerFrom';

type EditProps = {
    traveller: TravellerDetail;
};

function Edit({ traveller }: EditProps) {
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
                        Travellers
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Edit
                    </span>
                </>
            }
        >
            <Head title="Edit Traveller" />
            <EditTravellerForm traveller={traveller} />
        </AuthenticatedLayout>
    );
}

export default Edit;
