import { ChevronRight, UserRound, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import {
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import AuthenticatedMenuDashboard from './Partials/AuthenticatedMenuDashboard';
import AuthenticatedLogo from './Partials/AuthenticatedLogo';
import AuthenticatedMenuUsers from './Partials/AuthenticatedMenuUsers';
import AuthenticatedNotification from './Partials/AuthenticatedNotification';
import AuthenticatedProfile from './Partials/AuthenticatedProfile';
import AuthenticatedMenuSales from './Partials/AuthenticatedMenuSales';
import AuthenticatedMenuHotels from './Partials/AuthenticatedMenuHotels';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { url } = usePage();
    const user = usePage().props.auth.user;
    const [hotelsOpen, setHotelsOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Close flymenu when navigating to another page
    |--------------------------------------------------------------------------
    */
    const hotelsRef = useRef<HTMLDivElement>(null);
    const usersRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHotelsOpen(false);
        setUsersOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
    }, [url]);

    /*
    |--------------------------------------------------------------------------
    | Close flymenu when clicking outside
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            const clickedInsideHotels = hotelsRef.current?.contains(target);

            const clickedInsideUsers = usersRef.current?.contains(target);

            const clickedInsideNotification =
                notificationRef.current?.contains(target);

            const clickedInsideProfile = profileRef.current?.contains(target);

            if (
                !clickedInsideHotels &&
                !clickedInsideUsers &&
                !clickedInsideNotification &&
                !clickedInsideProfile
            ) {
                setHotelsOpen(false);
                setUsersOpen(false);
                setNotificationOpen(false);
                setProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Settings flymenu
    |--------------------------------------------------------------------------
    */
    const toggleMenu = (
        menu: 'hotels' | 'users' | 'notification' | 'profile',
    ) => {
        setHotelsOpen(menu === 'hotels' ? (current) => !current : false);
        setUsersOpen(menu === 'users' ? (current) => !current : false);
        setNotificationOpen(
            menu === 'notification' ? (current) => !current : false,
        );
        setProfileOpen(menu === 'profile' ? (current) => !current : false);
    };

    return (
        <div className="bg-secondary text-primary min-h-screen">
            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside className="inset-y-0 left-0 fixed z-50 flex w-[72px] flex-col border-r border-[#334155] bg-[#0F172A]">
                {/* -------------------------------------------------
                    Logo
                -------------------------------------------------- */}
                <AuthenticatedLogo />

                {/* -------------------------------------------------
                    Navigation
                -------------------------------------------------- */}

                <nav className="gap-2 px-2 py-5 flex flex-1 flex-col items-center">
                    {/* =================================================
                        DASHBOARD
                    ================================================== */}
                    <AuthenticatedMenuDashboard />

                    {/* =================================================
                        SALES
                    ================================================== */}
                    <AuthenticatedMenuSales />

                    {/* =================================================
                        SETTINGS
                    ================================================== */}
                    <AuthenticatedMenuHotels
                        url={url}
                        open={hotelsOpen}
                        onToggle={() => toggleMenu('hotels')}
                        containerRef={hotelsRef}
                    />

                    {/* =================================================
                        USERS
                    ================================================== */}
                    <AuthenticatedMenuUsers
                        open={usersOpen}
                        onToggle={() => toggleMenu('users')}
                        containerRef={usersRef}
                    />
                </nav>

                {/* -------------------------------------------------
                    Bottom Profile
                -------------------------------------------------- */}

                <div className="p-3 flex shrink-0 justify-center border-t border-[#334155]">
                    <button
                        type="button"
                        className="group h-10 w-10 hover:bg-quaternary-dark hover:text-white relative flex items-center justify-center rounded-full bg-[#334155] text-[#CBD5E1] transition"
                    >
                        <UserRound size={18} />

                        <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                            Travel Admin
                        </span>
                    </button>
                </div>
            </aside>

            {/* =====================================================
                TOP HEADER
            ====================================================== */}

            <header className="right-0 top-0 bg-white/95 backdrop-blur fixed left-[72px] z-40 h-[72px] border-b border-[#E2E8F0]">
                <div className="px-4 sm:px-6 lg:px-8 flex h-full items-center justify-between">
                    {/* Breadcrumb */}

                    <div className="min-w-0 gap-2 flex items-center">
                        <span className="text-xs text-quaternary-bright sm:block hidden">
                            TMS
                        </span>

                        <ChevronRight
                            size={14}
                            className="sm:block hidden text-[#CBD5E1]"
                        />

                        {header}
                    </div>

                    {/* Right Header */}

                    <div className="gap-2 sm:gap-4 flex items-center">
                        {/* Notification */}
                        <AuthenticatedNotification
                            open={notificationOpen}
                            onToggle={() => toggleMenu('notification')}
                            containerRef={notificationRef}
                        />

                        {/* Divider */}

                        <div className="h-7 sm:block hidden w-px bg-[#E2E8F0]" />

                        {/* Profile */}

                        <AuthenticatedProfile
                            open={profileOpen}
                            onToggle={() => toggleMenu('profile')}
                            containerRef={profileRef}
                            user={user}
                        />
                    </div>
                </div>
            </header>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main className="min-h-screen pt-[72px] pl-[72px]">
                <div className="p-2 sm:p-3 lg:p-4 mx-auto w-full max-w-[1290px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
