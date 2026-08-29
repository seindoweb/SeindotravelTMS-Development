import { Eye, Hotel, Plane, Search, X } from 'lucide-react';
import React, { useMemo, useState } from 'react'

type BookingStatus =
    | 'Confirmed'
    | 'Pending'
    | 'Completed'
    | 'Cancelled';

type Booking = {
    id: string;
    customer: string;
    service: 'Flight' | 'Hotel';
    date: string;
    amount: string;
    status: BookingStatus;
};

const bookings: Booking[] = [
    {
        id: 'BK-00124',
        customer: 'John Doe',
        service: 'Flight',
        date: '28 Aug 2026',
        amount: 'Rp 4.250.000',
        status: 'Confirmed',
    },
    {
        id: 'BK-00125',
        customer: 'Jane Doe',
        service: 'Hotel',
        date: '28 Aug 2026',
        amount: 'Rp 2.850.000',
        status: 'Pending',
    },
    {
        id: 'BK-00126',
        customer: 'Michael Smith',
        service: 'Flight',
        date: '27 Aug 2026',
        amount: 'Rp 6.100.000',
        status: 'Completed',
    },
    {
        id: 'BK-00127',
        customer: 'Sarah Wilson',
        service: 'Hotel',
        date: '27 Aug 2026',
        amount: 'Rp 3.450.000',
        status: 'Confirmed',
    },
    {
        id: 'BK-00128',
        customer: 'Robert Johnson',
        service: 'Flight',
        date: '26 Aug 2026',
        amount: 'Rp 5.750.000',
        status: 'Cancelled',
    },
];

export default function RecentBookingsTable() {
    const [search, setSearch] = useState('');
    const [selectedBooking, setSelectedBooking] =
        useState<Booking | null>(null);

    const filteredBookings = useMemo(() => {
        const keyword = search.toLowerCase();

        return bookings.filter((booking) =>
            [
                booking.id,
                booking.customer,
                booking.service,
                booking.date,
                booking.status,
            ]
                .join(' ')
                .toLowerCase()
                .includes(keyword)
        );
    }, [search]);
  return (
    <>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-secondary-dark p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-[#0F172A]">
                            Recent Bookings
                        </h2>

                        <p className="mt-1 text-xs text-quaternary">
                            Latest travel transactions
                        </p>
                    </div>

                    <div className="relative w-full sm:w-56">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary-bright"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search booking..."
                            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-secondary pl-9 pr-3 text-xs text-[#334155] outline-none transition placeholder:text-quaternary-bright focus:border-quaternary-bright focus:bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead>
                            <tr className="border-b border-secondary-dark bg-secondary">
                                {[
                                    'Booking ID',
                                    'Customer',
                                    'Service',
                                    'Travel Date',
                                    'Amount',
                                    'Status',
                                    'Action',
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary-bright"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-secondary-dark">
                            {filteredBookings.map(
                                (booking) => (
                                    <tr
                                        key={booking.id}
                                        className="transition hover:bg-secondary"
                                    >
                                        <td className="px-5 py-4 text-xs font-bold text-primary">
                                            {booking.id}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-dark text-[10px] font-bold text-quaternary-dark">
                                                    {booking.customer
                                                        .split(
                                                            ' '
                                                        )
                                                        .map(
                                                            (
                                                                word
                                                            ) =>
                                                                word[0]
                                                        )
                                                        .join(
                                                            ''
                                                        )
                                                        .slice(
                                                            0,
                                                            2
                                                        )}
                                                </div>

                                                <span className="text-xs font-medium text-[#334155]">
                                                    {
                                                        booking.customer
                                                    }
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-xs text-quaternary">
                                                {booking.service ===
                                                'Flight' ? (
                                                    <Plane
                                                        size={
                                                            14
                                                        }
                                                    />
                                                ) : (
                                                    <Hotel
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}

                                                {
                                                    booking.service
                                                }
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-quaternary">
                                            {booking.date}
                                        </td>

                                        <td className="px-5 py-4 text-xs font-semibold text-primary">
                                            {
                                                booking.amount
                                            }
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                status={
                                                    booking.status
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedBooking(
                                                        booking
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-[11px] font-semibold text-quaternary-dark transition hover:border-[#334155] hover:bg-secondary"
                                            >
                                                <Eye
                                                    size={
                                                        14
                                                    }
                                                />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}

                            {filteredBookings.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-12 text-center text-sm text-quaternary-bright"
                                    >
                                        No booking found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-secondary-dark px-5 py-4">
                            <div>
                                <h3 className="text-sm font-bold text-[#0F172A]">
                                    Booking Details
                                </h3>

                                <p className="mt-1 text-[11px] text-quaternary">
                                    {
                                        selectedBooking.id
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedBooking(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-quaternary-bright hover:bg-secondary-dark"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    label="Customer"
                                    value={
                                        selectedBooking.customer
                                    }
                                />

                                <DetailItem
                                    label="Service"
                                    value={
                                        selectedBooking.service
                                    }
                                />

                                <DetailItem
                                    label="Travel Date"
                                    value={
                                        selectedBooking.date
                                    }
                                />

                                <DetailItem
                                    label="Amount"
                                    value={
                                        selectedBooking.amount
                                    }
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-quaternary-bright">
                                    Status
                                </p>

                                <StatusBadge
                                    status={
                                        selectedBooking.status
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
  )
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-quaternary-bright">
                {label}
            </p>

            <p className="mt-1.5 text-xs font-semibold text-[#334155]">
                {value}
            </p>
        </div>
    );
}

const statusStyles: Record<
    BookingStatus,
    string
> = {
    Confirmed:
        'border-[#E2E8F0] bg-secondary-dark text-[#334155]',
    Pending:
        'border-[#E2E8F0] bg-secondary text-quaternary',
    Completed:
        'border-[#E2E8F0] bg-secondary-dark text-quaternary-dark',
    Cancelled:
        'border-tertiary/20 bg-tertiary/10 text-tertiary',
};

function StatusBadge({
    status,
}: {
    status: BookingStatus;
}) {
    return (
        <span
            className={[
                'inline-flex items-center rounded-full border',
                'px-2.5 py-1 text-[11px] font-semibold',
                statusStyles[status],
            ].join(' ')}
        >
            <span
                className={[
                    'mr-1.5 h-1.5 w-1.5 rounded-full',
                    status === 'Cancelled'
                        ? 'bg-tertiary'
                        : 'bg-quaternary',
                ].join(' ')}
            />

            {status}
        </span>
    );
}
