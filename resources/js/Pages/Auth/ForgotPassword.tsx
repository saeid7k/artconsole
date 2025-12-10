import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Alert, Button, Input } from 'antd';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
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

      <div className="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email
        address and we will email you a password reset link that will
        allow you to choose a new one.
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status == 'passwords.sent' ? "A password reset link has been sent to your email address." : status}
        </div>
      )}

      <form onSubmit={submit}>

        <Input
          type='email'
          placeholder='Email'
          autoComplete="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          required
        />
        {errors.email && (
          <Alert title={errors.email} type="error" />
        )}

        <div className="mt-4 flex items-center justify-end gap-3">
          <Link
            href={route('login')}
            className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
          >
            Back to Login
          </Link>
          <Button
            type="primary"
            className=""
            disabled={processing}
            htmlType="submit"
          >
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
