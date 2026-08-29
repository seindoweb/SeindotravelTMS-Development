import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useT } from '@/helpers';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status, appLogo, appName, }: {
        status?: string;
        appLogo: string;
        appName: string;
    }) {
    const t = useT();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        alt={appName}
                        src={appLogo}
                        className="object-cover w-auto h-24 mx-auto"
                    />

                        <p className="mt-2 tracking-tight text-center text-gray-500 text-sm/6">
                        <span className="font-semibold text-primary">
                            Forgot your password? No problem.
                        </span>{" "}
                        Just let us know your email address and we will email
                        you a password reset link that will allow you to choose
                        a new one.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="px-6 py-12 bg-white shadow-sm sm:rounded-lg sm:px-12">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-center text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full mt-1"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />

                            <div className="flex items-center justify-end mt-5">
                                <PrimaryButton className="justify-center w-full" disabled={processing}>
                                    Email Password Reset Link
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
