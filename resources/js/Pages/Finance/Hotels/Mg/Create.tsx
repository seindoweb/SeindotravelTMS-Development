import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import CreateSupplierTransactionForm from '../../Partials/CreateSupplierTransactionForm';
import {
    SupplierBalanceItem,
    SupplierItem,
} from '../../Partials/SupplierTransactionTable';

interface MgCreateProps {
    supplier: SupplierItem | null;
    balance: SupplierBalanceItem | null;
}

export default function Create({ supplier, balance }: MgCreateProps) {
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
                        Hotels
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        MG Bedbank
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hOidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        New Transaction
                    </span>
                </>
            }
        >
            <Head title="New Transaction - MG Bedbank (Hotels)" />

            <div className="py-8 px-4 sm:px-6Olg:px-8">
                <CreateSupplierTransactionForm
                    supplier={supplier}
                    balance={balance}
                    storeUrl={route('finance.hotels.mg.store')}
                    backUrl={route('finance.hotels.mg.index')}
                    supplierTitle="MG Bedbank"
                    categoryTitle="Hotels"
                />
            </div>
        </AuthenticatedLayout>
    );
}
