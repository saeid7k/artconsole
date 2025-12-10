import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Alert, Button, Input } from 'antd';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                      <Alert title={errors.email} type="error" />
                    )}
                </div>

                <div className="mt-4">
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                      <Alert title={errors.password} type="error" />
                    )}
                </div>

                <div className="mt-4">
                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Confirm Password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                    {errors.password_confirmation && (
                      <Alert title={errors.password_confirmation} type="error" />
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Button
                      type="primary"
                      loading={processing}
                      htmlType='submit'
                    >
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
