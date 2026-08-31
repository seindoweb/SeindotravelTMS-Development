import {
    ChevronRight,
    UserRound,
    X,
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import {
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
    ReactNode
} from 'react';
import AuthenticatedMenuDashboard from './Partials/AuthenticatedMenuDashboard';
import AuthenticatedLogo from './Partials/AuthenticatedLogo';
import AuthenticatedMenuUsers from './Partials/AuthenticatedMenuUsers';
import AuthenticatedMenuSettings from './Partials/AuthenticatedMenuSettings';
import AuthenticatedNotification from './Partials/AuthenticatedNotification';
import AuthenticatedProfile from './Partials/AuthenticatedProfile';


export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const [settingsOpen, setSettingsOpen] =
        useState(false);

    const [usersOpen, setUsersOpen] =
        useState(false);

    const [notificationOpen, setNotificationOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Close flymenu when navigating to another page
    |--------------------------------------------------------------------------
    */
    const settingsRef = useRef<HTMLDivElement>(null);
    const usersRef =  useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSettingsOpen(false);
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

            const clickedInsideSettings =
                settingsRef.current?.contains(target);

            const clickedInsideUsers =
                usersRef.current?.contains(target);

            const clickedInsideNotification =
                notificationRef.current?.contains(target);

            const clickedInsideProfile =
                profileRef.current?.contains(target);

            if (
                !clickedInsideSettings &&
                !clickedInsideUsers &&
                !clickedInsideNotification &&
                !clickedInsideProfile
            ) {
                setSettingsOpen(false);
                setUsersOpen(false);
                setNotificationOpen(false);
                setProfileOpen(false);
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Settings flymenu
    |--------------------------------------------------------------------------
    */
    const toggleSettings = () => {
        setSettingsOpen((current) => !current);
        setUsersOpen(false);
    };

    const toggleUsers = () => {
        setUsersOpen((current) => !current);
        setSettingsOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen((current) => !current);

        setSettingsOpen(false);
        setUsersOpen(false);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen((current) => !current);

        setNotificationOpen(false);
        setSettingsOpen(false);
        setUsersOpen(false);
    };

    return (
        <div className="min-h-screen bg-secondary text-primary">

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside className="fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col border-r border-[#334155] bg-[#0F172A]">

                {/* -------------------------------------------------
                    Logo
                -------------------------------------------------- */}
                <AuthenticatedLogo />


                {/* -------------------------------------------------
                    Navigation
                -------------------------------------------------- */}

                <nav className="flex flex-col items-center flex-1 gap-2 px-2 py-5">

                    {/* =================================================
                        DASHBOARD
                    ================================================== */}
                    <AuthenticatedMenuDashboard url={url} />

                    {/* =================================================
                        USERS
                    ================================================== */}
                    <AuthenticatedMenuUsers url={url}
                        open={usersOpen}
                        onToggle={toggleUsers}
                        containerRef={usersRef}/>
                    {/* =================================================
                        SETTINGS
                    ================================================== */}
                    <AuthenticatedMenuSettings url={url}
                        open={settingsOpen}
                        onToggle={toggleSettings}
                        containerRef={settingsRef}
                    />

                </nav>

                {/* -------------------------------------------------
                    Bottom Profile
                -------------------------------------------------- */}

                <div className="flex shrink-0 justify-center border-t border-[#334155] p-3">
                    <button
                        type="button"
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#334155] text-[#CBD5E1] transition hover:bg-quaternary-dark hover:text-white"
                    >
                        <UserRound size={18} />

                        <span className="pointer-events-none absolute left-[58px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                            Travel Admin
                        </span>
                    </button>
                </div>
            </aside>

            {/* =====================================================
                TOP HEADER
            ====================================================== */}

            <header className="fixed left-[72px] right-0 top-0 z-40 h-[72px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur">

                <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}

                    <div className="flex items-center min-w-0 gap-2">
                        <span className="hidden text-xs text-quaternary-bright sm:block">
                            TMS
                        </span>

                        <ChevronRight
                            size={14}
                            className="hidden text-[#CBD5E1] sm:block"
                        />

                        {header}
                    </div>

                    {/* Right Header */}

                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Notification */}
                        <AuthenticatedNotification
                            open={notificationOpen}
                            onToggle={toggleNotification}
                            containerRef={notificationRef}
                        />


                        {/* Divider */}

                        <div className="hidden h-7 w-px bg-[#E2E8F0] sm:block" />

                        {/* Profile */}

                        <AuthenticatedProfile
                            open={profileOpen}
                            onToggle={toggleProfile}
                            containerRef={profileRef}
                            user={user}
                        />
                    </div>
                </div>
            </header>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main className="min-h-screen pl-[72px] pt-[72px]">
                <div className="mx-auto w-full max-w-[1290px] p-2 sm:p-3 lg:p-4">
                    {children}
                </div>
            </main>

            {/* =====================================================
                MOBILE CLOSE BUTTON FOR OPEN FLYMENU
            ====================================================== */}

            {settingsOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() =>
                        setSettingsOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-transparent"
                />
            )}

            {/* =====================================================
                MOBILE FLYMENU CLOSE
            ====================================================== */}

            {settingsOpen && (
                <button
                    type="button"
                    onClick={() =>
                        setSettingsOpen(false)
                    }
                    className="fixed bottom-4 right-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-quaternary shadow-xl lg:hidden"
                >
                    <X size={17} />
                </button>
            )}
        </div>
    );
}
