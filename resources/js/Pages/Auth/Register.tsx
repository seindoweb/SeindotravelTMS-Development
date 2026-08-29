import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useT } from '@/helpers';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register(
    {
        appLogo,
        appName,
    }: {
        appLogo: string;
        appName: string;
    }) {
    const t = useT();
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        alt={appName}
                        src={appLogo}
                        className="object-cover w-auto h-24 mx-auto"
                    />

                    <h2 className="mt-0 font-bold tracking-tight text-center text-gray-900 text-2xl/9 ">
                        {t("auth.title_register")}
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="px-6 py-12 shadow-sm bg-secondary-bright sm:rounded-lg sm:px-12">
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="full_name" value="Full Name" />

                                <TextInput
                                    id="full_name"
                                    name="full_name"
                                    value={data.full_name}
                                    className="block w-full mt-1"
                                    autoComplete="full_name"
                                    isFocused={true}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                />

                                <InputError message={errors.full_name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full mt-1"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className='mt-4'>
                                <PrimaryButton className="justify-center w-full" disabled={processing}>
                                    Register
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                    <p className="flex justify-center mt-10 text-center text-gray-500 text-sm/6">
                        {t("auth.already_have_an_account")}{" "}
                        <Link
                            href={route('login')}
                            className="font-semibold underline rounded-md ms-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-quaternary-dark focus:ring-offset-2 text-primary"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
