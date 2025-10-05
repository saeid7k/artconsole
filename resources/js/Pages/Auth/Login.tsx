import InputError from '@/Components/InputError';
// import PrimaryButton from '@/components/PrimaryButton';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Checkbox, Input, Space } from 'antd';
import { FormEventHandler } from 'react';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      // onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Login" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={submit}>
        <Space
          direction="vertical"
          className='w-full'
          size={'middle'}
        >
          <div>
            <Input
              type='email'
              placeholder='Email'
              autoComplete="email"
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            <InputError message={errors.email} className="mt-2" />
          </div>

          <div>
            <Input.Password
              placeholder='Password'
              onChange={(e) => setData('password', e.target.value)}
              required
            />
            <InputError message={errors.password} className="mt-2" />
          </div>

          <Checkbox
            id="remember"
            onChange={(e) => setData('remember', (e.target as HTMLInputElement).checked)}
          >
            Remember me
          </Checkbox>
        </Space>

        <Space
          className='w-full justify-end mt-4'
        >
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Forgot your password?
            </Link>
          )}

          <Button
            type="primary"
            disabled={processing}
            htmlType='submit'
          >
            Log in
          </Button>
        </Space>
      </form>
    </GuestLayout>
  );
}
