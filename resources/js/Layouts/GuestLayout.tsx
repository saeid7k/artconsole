import ServerFlashMessage from '@/Components/ServerFlashMessage';
import { APP } from '@/constants/appConstants';
import colors from '@/Themes/theme';
import { oklchToHex } from '@/utils/colorHelper';
import { StyleProvider } from '@ant-design/cssinjs';
import { Link } from '@inertiajs/react';
import { Card, ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';

function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col gap-3 items-center bg-light pt-10">
      <div>
        <Link href="/">
          <img src={APP.logo_sm} alt="Logo" className="w-15 h-15 p-1 mb-1" />
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
    <StyleProvider layer >
      <ConfigProvider
        theme={{
          token: {
            colorBgLayout: colors.white,
            colorPrimary: colors.primary['500'],
            colorTextSecondary: oklchToHex(colors.gray['500']),
            colorTextLabel: oklchToHex(colors.gray['300']),
          },
        }}
      >
        <Guest>
          {children}
        </Guest>
        <ServerFlashMessage />
      </ConfigProvider>
    </StyleProvider>
  )
}
