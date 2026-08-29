import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useT } from '@/helpers';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
    appLogo,
    appName,
}: {
    status?: string;
    canResetPassword: boolean;
    appLogo: string;
    appName: string;
}) {
    const t = useT();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        alt={appName}
                        src={appLogo}
                        className="object-cover w-auto h-24 mx-auto"
                    />

                    <h2 className="mt-0 font-bold tracking-tight text-center text-gray-900 text-2xl/9 ">
                        {t("auth.title_login")}
                    </h2>
                </div>



                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="px-6 py-12 shadow-sm bg-secondary-bright sm:rounded-lg sm:px-12">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-center text-green-600">
                                {status}
                            </div>
                        )}
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full mt-1"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full mt-1"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>


                            <div className="flex items-center justify-between mt-4">
                                <div className="flex gap-3">
                                    <div className="flex items-center h-6 shrink-0">
                                        <div className="grid grid-cols-1 group size-4">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        (e.target.checked ||
                                                            false) as false,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="remember-me"
                                        className="block text-gray-900 text-sm/6"
                                    >
                                        {t("auth.remember_me")}
                                    </label>
                                </div>

                                <div className="text-sm/6">
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm font-semibold underline rounded-md text-primary hover:text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
                                        >
                                            {t("auth.forgot_password")}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className='mt-4'>
                                <PrimaryButton
                                    className="justify-center w-full"
                                    disabled={processing}
                                >
                                    {t("auth.login")}
                                </PrimaryButton>
                            </div>
                        </form>

                        <div>
                            <div className="flex items-center mt-10 gap-x-6">
                                <div className="flex-1 w-full border-t border-gray-200" />
                                <p className="font-medium text-gray-900 text-sm/6 text-nowrap">
                                    {t("auth.or_continue_with")}
                                </p>
                                <div className="flex-1 w-full border-t border-gray-200" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button className="flex items-center justify-center w-full gap-3 px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-xs cursor-not-allowed inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span className="font-semibold text-sm/6">
                                        Google
                                    </span>
                                </button>

                                <button className="flex items-center justify-center w-full gap-3 px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-xs cursor-not-allowed inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent">
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        className="size-5 fill-[#24292F]"
                                    >
                                        <path
                                            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                    <span className="font-semibold text-sm/6">
                                        GitHub
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="flex justify-center mt-10 text-center text-gray-500 text-sm/6">
                        {t("auth.not_a_member")}{" "}
                        <p className="ml-1 font-semibold text-primary">
                            {t("auth.contact_person")}
                        </p>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
