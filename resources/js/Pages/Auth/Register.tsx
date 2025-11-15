import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Alert, Button, Input, InputRef } from 'antd';
import React, { FormEventHandler, useEffect, useRef } from 'react';

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

  const firstnameRef = useRef<InputRef>(null);

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
              ref={firstnameRef}
              size='large'
            />
            {errors.firstname && (
              <Alert message={errors.firstname} type="error" />
            )}
          </div>

          <div>
            <Input
              type='text'
              placeholder='Last Name'
              value={data.lastname}
              autoComplete="lastname"
              onChange={(e) => setData('lastname', e.target.value)}
              size='large'
            />
            {errors.lastname && (
              <Alert message={errors.lastname} type="error" />
            )}
          </div>

          <div>
            <Input
              type='email'
              placeholder='Email'
              value={data.email}
              autoComplete="email"
              onChange={(e) => setData('email', e.target.value)}
              required
              size='large'
            />
            {errors.email && (
              <Alert message={errors.email} type="error" />
            )}
          </div>

          <div>
            <Input
              type='password'
              placeholder='Password'
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
              size='large'
            />
            {errors.password && (
              <Alert message={errors.password} type="error" />
            )}
          </div>

          <div>
            <Input
              type='password'
              placeholder='Confirm Password'
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
              size='large'
            />
            {errors.password_confirmation && (
              <Alert message={errors.password_confirmation} type="error" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-end gap-3">
          <Button
            type="primary"
            disabled={processing}
            htmlType='submit'
          >
            Register
          </Button>
          <Link
            href={route('login')}
            className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
          >
            Already registered? Login here.
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
