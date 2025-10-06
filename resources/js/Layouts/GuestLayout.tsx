import LogoBox from '@/Components/LogoBox';
import { Link } from '@inertiajs/react';
import { Card } from 'antd';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col gap-3 items-center bg-light pt-10">
      <div>
        <Link href="/">
          <LogoBox />
        </Link>
      </div>
      <Card
        className='w-full max-w-md shadow-md'
      >
        {children}
      </Card>
    </div>
  );
}
