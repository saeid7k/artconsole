import LogoBox from '@/Components/LogoBox';
import colors from '@/Themes/theme';
import { Link } from '@inertiajs/react';
import { Card, ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';

function Guest({ children }: PropsWithChildren) {
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

export default function GuestLayout({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorBgLayout: colors.white,
          colorPrimary: colors.purple['500'],
          colorTextSecondary: colors.gray['500'],
          colorTextLabel: colors.gray['300'],

          // Alias Token
          // colorBgContainer: '#f6ffed',
        },
      }}
    >
      <Guest>
        {children}
      </Guest>
    </ConfigProvider>
  )
}
