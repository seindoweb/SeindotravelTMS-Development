import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import CreateSupplierTransactionForm from '../../Partials/CreateSupplierTransactionForm';
import {
    SupplierBalanceItem,
    SupplierItem,
} from '../../Partials/SupplierTransactionTable';

interface ViaCreateProps {
    supplier: SupplierItem | null;
    balance: SupplierBalanceItem | null;
}

export default function Create({ supplier, balance }: ViaCreateProps) {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Finances
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Flights
                    </span>
                    <ChevronRight
                        size={14}           
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Via.com
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        New Transaction
                    </span>
                </>
            }
        >
            <Head title="New Transaction - Via.com (Flights)" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <CreateSupplierTransactionForm
                    supplier={supplier}
                    balance={balance}
                    storeUrl={route('finance.flights.via.store')}
                    backUrl={route('finance.flights.via.index')}
                    supplierTitle="Via.com"
                    categoryTitle="Flights"
                />
            </div>
        </AuthenticatedLayout>
    );
}
