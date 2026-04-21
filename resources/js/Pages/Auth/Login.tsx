import FlexBox from '@/Components/Containers/FlexBox';
import StyledDivider from '@/Components/StyledDivider';
import GuestLayout from '@/Layouts/GuestLayout';
import googleLogo from '@images/logo/google-logo.svg';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Checkbox, Input } from 'antd';
import { FormEventHandler, useEffect } from 'react';

type Props = {
  status?: string;
  canResetPassword: boolean;
  default_values?: {
    email: string;
    password: string;
  };
};

export default function Login({ status, canResetPassword, default_values }: Props) {

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  useEffect(() => {
    if (default_values) {
      setData(default_values);
    }
  }, []);

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
          {status == 'passwords.reset' ? "Your password has been reset!" : status}
        </div>
      )}

      <form onSubmit={submit}>
        <div
          className='flex flex-col gap-5 w-full'
        >
          <div>
            <Input
              type='email'
              placeholder='Email'
              autoComplete="email"
              onChange={(e) => setData('email', e.target.value)}
              value={data.email}
              required
              size='large'
            />
            {/* <InputError message={errors.email} className="mt-2" /> */}
          </div>

          <div>
            <Input.Password
              placeholder='Password'
              onChange={(e) => setData('password', e.target.value)}
              value={data.password}
              required
              size='large'
            />
            {/* <InputError message={errors.password} className="mt-2" /> */}
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="block text-sm text-right text-gray-600 underline hover:text-gray-900 focus:outline-none"
              >
                Forgot your password?
              </Link>
            )}
          </div>

          <Checkbox
            id="remember"
            onChange={(e) => setData('remember', (e.target as HTMLInputElement).checked)}
          >
            Remember me
          </Checkbox>

          <Button
            type="primary"
            disabled={processing}
            htmlType='submit'
            size='large'
          >
            Log in
          </Button>

        </div>
      </form>

      <StyledDivider variant='light' >OR</StyledDivider>

      <div className="flex flex-col gap-3">
        <Button
          type="default"
          size='large'
          href={route('auth.google')}
          className="w-full"
        >
          <FlexBox gap={3} >
            <img src={googleLogo} alt="Google Logo" className="h-5 w-5" />
            Continue with Google
          </FlexBox>
        </Button>
        <Button
          type="dashed"
          size='large'
          onClick={() => router.visit(route('register'))}
          className="w-full"
        >
          Register with email
        </Button>
      </div>
    </GuestLayout>
  );
}
