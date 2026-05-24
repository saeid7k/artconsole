import ServerFlashMessage from '@/Components/ServerFlashMessage';
import { APP } from '@/constants/appConstants';
import { useWindow } from '@/hooks/useWindow';
import colors from '@/Themes/theme';
import { oklchToHex } from '@/utils/colorHelper';
import { StyleProvider } from '@ant-design/cssinjs';
import backgroundImage from '@images/login-background-02.jpg';
import { Link } from '@inertiajs/react';
import { Card, ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

function Guest({ children }: PropsWithChildren) {

  const { windowWidth } = useWindow()

  return (
    <div
      className={twMerge(
        "h-screen",
        windowWidth > 1024 && "p-5",
      )}
    >
      <div
        className={twMerge(
          "relative h-[100%] w-[100%] m-auto px-5 py-10",
          windowWidth > 1024 && "rounded-lg",
          windowWidth <= 640 && "bg-primary-50",
        )}
        style={{
          backgroundImage: windowWidth > 640 ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Card
          className={twMerge(
            'shadow-md',
            windowWidth <= 1024 && "max-w-[400px] m-auto",
            windowWidth > 1024 && "absolute right-20 top-1/2 -translate-y-1/2 min-w-[400px]"
          )}
          style={{
            backgroundColor: `rgba(255, 255, 255, 0.9)`,
          }}
        >
          <div
            className='w-full flex flex-col items-stretch gap-5'
          >
            <Link href="/">
              <img src={APP.logo_sm} alt="Logo" className="w-15 h-15 p-1 mb-1 mx-auto" />
            </Link>
            {children}
          </div>
        </Card>
      </div>
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
