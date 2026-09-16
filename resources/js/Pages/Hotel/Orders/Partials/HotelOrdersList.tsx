import { TableHeader } from '@/Components/TableHeading/TableHeader';
import { Menu, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    Filter,
    MoreVertical
} from 'lucide-react';
import { Fragment, useState } from 'react';

const DUMMY_ORDERS = [
    {
        id: 1,
        firstName: 'Tri',
        lastName: 'Yuda',
        email: 'xdhaastore1401@gmail.com',
        orderCode: '260220-39-0001',
        orderStatus: 'Issued',
        paymentStatus: 'Paid',
        paymentMethod: 'Online Pay',
        admin: 'Customer',
        orderDate: "20 Feb '26",
        orderTime: '13:27',
    },
    {
        id: 2,
        firstName: 'VVIP Travel',
        lastName: 'PH',
        email: 'vvip.travelph@gmail.com',
        orderCode: '251209-63-0002',
        orderStatus: 'Issued',
        paymentStatus: 'Expired',
        paymentMethod: 'Pay Manual',
        admin: 'Agent VVIP TRAVEL',
        orderDate: "09 Dec '25",
        orderTime: '17:05',
    },
    {
        id: 3,
        firstName: 'Lilys',
        lastName: 'Ng',
        email: 'lilys_31@yahoo.com',
        orderCode: '240616-39-0003',
        orderStatus: 'Pending', 
        paymentStatus: 'Unpaid',
        paymentMethod: 'Pay Manual',
        admin: 'Customer',
        orderDate: "16 Jun '24",
        orderTime: '15:03',
    },
    {
        id: 4,
        firstName: 'Dennis',
        lastName: 'Lie',
        email: 'liedennis16@gmail.com',
        orderCode: '240328-22-0003',
        orderStatus: 'Issued',
        paymentStatus: 'Paid',
        paymentMethod: 'Pay Manual',
        admin: 'Customer',
        orderDate: "28 Mar '24",
        orderTime: '08:13',
    },
    {
        id: 5,
        firstName: 'Seindo Global',
        lastName: 'Travel',
        email: 'sales.seindoglobal@gmail.com',
        orderCode: '240325-76-0001',
        orderStatus: 'Cancelled',
        paymentStatus: 'Refunded',
        paymentMethod: 'Online Pay',
        admin: 'Annisa F.',
        orderDate: "25 Mar '24",
        orderTime: '11:10',
    }
];

const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = "bg-gray-100 text-gray-700";
    let dotClass = "bg-gray-400";
    
    if (status === 'Issued') {
        colorClass = "bg-emerald-50 text-emerald-700";
        dotClass = "bg-emerald-500";
    } else if (status === 'Pending') {
        colorClass = "bg-amber-50 text-amber-700";
        dotClass = "bg-amber-500";
    } else if (status === 'Cancelled') {
        colorClass = "bg-red-50 text-red-700";
        dotClass = "bg-red-500";
    }

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></div>
            {status}
        </div>
    );
};

const PaymentStatusText = ({ status }: { status: string }) => {
    let colorClass = "text-gray-500";
    if (status === 'Paid') colorClass = "text-emerald-600";
    if (status === 'Expired') colorClass = "text-red-500";
    if (status === 'Unpaid') colorClass = "text-amber-500";

    return (
        <span className={`font-bold text-xs ${colorClass}`}>
            {status}
        </span>
    );
};
function HotelOrdersList() {
    const [searchQuery, setSearchQuery] = useState("");
    
  return (
      <div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <TableHeader 
                title="Hotel Orders List"
                subtitle={<>Total: <span className="font-bold text-primary">741</span> orders found</>}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                actions={[
                    {
                        label: "Filter",
                        icon: <Filter size={14} />,
                        variant: "secondary"
                    }
                ]}
            />

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E2E8F0] bg-white">
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Customer</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Order Code</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Payment</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Admin</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">Order Date</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0]">
                                    {DUMMY_ORDERS.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs text-primary">
                                                        {order.firstName} {order.lastName}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {order.email}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                                                    <span className="text-xs font-mono font-medium text-gray-600">
                                                        ...{order.orderCode.slice(2)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <StatusBadge status={order.orderStatus} />
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <PaymentStatusText status={order.paymentStatus} />
                                                    <span className="text-xs font-medium text-quaternary">
                                                        {order.paymentMethod}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="text-xs font-medium text-primary">
                                                    {order.admin}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex flex-col text-right sm:text-left">
                                                    <span className="text-xs font-bold text-primary">
                                                        {order.orderDate}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {order.orderTime}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 text-quaternary transition-colors">
                                                        <MoreVertical size={16} />
                                                    </Menu.Button>
                                                    
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                            <div className="p-1">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <Link href={route('hotel.orders.orderDetails', { id: order.id })} className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-gray-50 text-primary' : 'text-gray-700'}`}>
                                                                            <Eye size={16} className="text-gray-400 group-hover:text-primary" />
                                                                            View Details
                                                                        </Link>
                                                                    )}
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-gray-50 text-primary' : 'text-gray-700'}`}>
                                                                            <Edit size={16} className="text-gray-400 group-hover:text-primary" />
                                                                            Edit Order
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                            <div className="p-1">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${active ? 'bg-gray-50 text-blue-600' : 'text-blue-600'}`}>
                                                                            <Download size={16} className="text-blue-500" />
                                                                            Download PDF
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-quaternary font-medium">
                    Showing <span className="font-bold text-primary">1</span> to <span className="font-bold text-primary">5</span> of <span className="font-bold text-primary">741</span> entries
                </span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border border-gray-200 bg-white text-gray-400 rounded-lg text-sm font-medium" disabled>Prev</button>
                    <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold shadow-sm">1</button>
                    <button className="px-3 py-1 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">2</button>
                    <button className="px-3 py-1 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">3</button>
                    <span className="px-2 py-1 text-gray-400">...</span>
                    <button className="px-3 py-1 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">Next</button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default HotelOrdersList