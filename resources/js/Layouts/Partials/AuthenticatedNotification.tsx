import { Bell } from 'lucide-react';

interface AuthenticatedNotificationProps {
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedNotification({
    open,
    onToggle,
    containerRef,
}: AuthenticatedNotificationProps) {
    return (
        <div
            ref={containerRef}
            className="relative"
        >

            {/* =====================================================
                NOTIFICATION BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Notifications"
                aria-expanded={open}
                className={[
                    'relative flex h-10 w-10 items-center justify-center rounded-xl',
                    'text-quaternary transition-all duration-200',
                    'hover:bg-secondary-dark hover:text-primary',

                    open
                        ? 'bg-secondary-dark text-primary'
                        : '',
                ].join(' ')}
            >
                <Bell
                    size={19}
                    strokeWidth={2}
                />

                {/* Notification indicator */}

                <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-tertiary ring-2 ring-white" />
            </button>


            {/* =====================================================
                NOTIFICATION FLYMENU
            ====================================================== */}

            <div
                className={[
                    'absolute right-0 top-12 z-[100] w-[300px]',
                    'origin-top-right transition-all duration-200 ease-out',

                    open
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
                ].join(' ')}
            >

                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div className="px-4 py-4 border-b border-secondary-dark">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-bold text-primary">
                                    Notifications
                                </p>

                                <p className="mt-0.5 text-[10px] text-quaternary-bright">
                                    Recent system updates
                                </p>

                            </div>

                            <span className="rounded-full bg-tertiary/10 px-2 py-1 text-[9px] font-bold text-tertiary">
                                3 NEW
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        NOTIFICATION LIST
                    ================================================== */}

                    <div className="divide-y divide-secondary-dark">

                        {/* New Booking */}

                        <div className="px-4 py-3 transition cursor-pointer hover:bg-secondary">

                            <p className="text-xs font-semibold text-[#334155]">
                                New booking received
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-quaternary-bright">
                                BK-00129 requires confirmation.
                            </p>

                        </div>


                        {/* Payment */}

                        <div className="px-4 py-3 transition cursor-pointer hover:bg-secondary">

                            <p className="text-xs font-semibold text-[#334155]">
                                Payment pending
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-quaternary-bright">
                                24 payments need attention.
                            </p>

                        </div>


                        {/* Report */}

                        <div className="px-4 py-3 transition cursor-pointer hover:bg-secondary">

                            <p className="text-xs font-semibold text-[#334155]">
                                Monthly report ready
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-quaternary-bright">
                                July travel report is available.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
