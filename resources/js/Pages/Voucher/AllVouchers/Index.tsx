import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
// import ListCustomerTable from './Partials/ListCustomerTable';

interface Props {
    product_attribute: string;
    title: string;
}
export default function Index({ product_attribute, title }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Vouchers
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        {title}
                    </span>
                </>
            }
        >
            <Head title="Customers" />
            {/* <ListCustomerTable /> */}
        </AuthenticatedLayout>
    );
}
