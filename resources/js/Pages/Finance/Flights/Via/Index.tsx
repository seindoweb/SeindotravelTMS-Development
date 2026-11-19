import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginate } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import SupplierTransactionTable, {
    SupplierBalanceItem,
    SupplierItem,
    SupplierTransactionItem,
} from '../../Partials/SupplierTransactionTable';

interface ViaIndexProps {
    supplier: SupplierItem | null;
    balance: SupplierBalanceItem | null;
    transactions: Paginate<SupplierTransactionItem>;
    filters?: {
        search?: string;
        transaction_type?: string;
    };
}

export default function Index({
    supplier,
    balance,
    transactions,
    filters = {},
}: ViaIndexProps) {
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
                </>
            }
        >
            <Head title="Finances - Via.com (Flights)" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SupplierTransactionTable
                    supplier={supplier}
                    balance={balance}
                    transactions={transactions}
                    createUrl={route('finance.flights.via.create')}
                    indexUrl={route('finance.flights.via.index')}
                    supplierTitle="Via.com"
                    categoryTitle="Flights"
                    filters={filters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
