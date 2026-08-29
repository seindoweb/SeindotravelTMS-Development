import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status, appName, appLogo }: {
    status?: string;
    appName: string;
    appLogo: string;
    }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

             <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        alt={appName}
                        src={appLogo}
                        className="object-cover w-auto h-24 mx-auto"
                    />

                        <p className="mt-2 tracking-tight text-center text-gray-500 text-sm/6">
                        <span className="font-semibold text-primary">
                            Thanks for signing up!
                        </span>{" "}
                        Before getting started, could you verify
                        your email address by clicking on the link we just emailed to
                        you? If you didn't receive the email, we will gladly send you
                        another.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="px-6 py-12 bg-white shadow-sm sm:rounded-lg sm:px-12">
                        {status === 'verification-link-sent' && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                A new verification link has been sent to the email address
                                you provided during registration.
                            </div>
                        )}
                        <form onSubmit={submit}>
                            <div className="flex flex-col items-center justify-between mt-4">
                                <PrimaryButton className='justify-center w-full' disabled={processing}>
                                    Resend Verification Email
                                </PrimaryButton>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="mt-5 text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
