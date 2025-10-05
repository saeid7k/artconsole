import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from 'antd';
import React, { FormEventHandler, useEffect } from 'react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    firstname: '',
    lastname: '',
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

  const firstnameRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstnameRef.current?.focus();
  }, []);

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div className="flex flex-col gap-3">
          <div>
            <Input
              type='text'
              placeholder='First Name'
              value={data.firstname}
              autoComplete="name"
              onChange={(e) => setData('firstname', e.target.value)}
              // ref={firstnameRef}
            />
            <InputError message={errors.firstname} className="mt-2" />
          </div>

          <div>
            <Input
              type='text'
              placeholder='Last Name'
              value={data.lastname}
              autoComplete="lastname"
              onChange={(e) => setData('lastname', e.target.value)}
            />
            <InputError message={errors.lastname} className="mt-2" />
          </div>

          <div>
            <Input
              type='email'
              placeholder='Email'
              value={data.email}
              autoComplete="email"
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            <InputError message={errors.email} className="mt-2" />
          </div>

          <div>
            <Input
              type='password'
              placeholder='Password'
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
            />
            <InputError message={errors.password} className="mt-2" />
          </div>

          <div>
            <Input
              type='password'
              placeholder='Confirm Password'
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
            />
            <InputError message={errors.password_confirmation} className="mt-2" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href={route('login')}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={processing}>
            Register
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
