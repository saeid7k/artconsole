import GallerySwitch from "@/Components/GallerySwitch";
import Sidebar from "@/Components/Sidebar";
import UserMenu from "@/Components/UserMenu";
import AppProvider, { useApp } from "@/contexts/AppContext";
import { useWindow } from "@/hooks/useWindow";
import colors from "@/Themes/theme";
import { ArrowLeftDoubleFreeIcons, ArrowRightDoubleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Button, ConfigProvider, Layout, message } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { PropsWithChildren, useEffect } from "react";

interface AppProps extends PropsWithChildren {
  title?: string|React.ReactNode,
  actionsBar?: React.ReactNode | null,
}

function App ({ title = '', actionsBar = null, children }: AppProps) {

  const flash: any = usePage().props.flash;
  const { sidebarCollapsed, toggleSidebar } = useApp()
  const { scrollY } = useWindow()
  const collapsedWidth = 50
  const expandedWidth = 200

  useEffect(() => {
    if (flash?.type == 'success' && flash?.message) {
      message.success(flash.message, 3);
    }
    if (flash?.type == 'error' && flash?.error) {
      message.error(flash.error, 5);
    }
  }, [flash]);

  return (
    <Layout className="fixed w-full h-full">
      <Header
        className={`flex justify-between items-center bg-light leading-normal sticky top-0 z-10 w-full transition-all ${
          scrollY > 0 ? ' shadow-md' : ''
        }`}
      >
        <div>
          <GallerySwitch />
        </div>
        <div>
          <UserMenu />
        </div>
      </Header>
      <Layout className="relative">
        <Button
          shape="circle"
          type="default"
          className={`absolute top-2 z-10`}
          style={{ left: sidebarCollapsed ? collapsedWidth - 16 : expandedWidth - 16 }}
          onClick={toggleSidebar}
        >
          <HugeiconsIcon size={20} icon={ArrowLeftDoubleFreeIcons} altIcon={ArrowRightDoubleFreeIcons} showAlt={sidebarCollapsed} />
        </Button>
        <Sider
          theme="light"
          className="h-full bg-light overflow-y-auto overflow-x-visible"
          collapsed={sidebarCollapsed}
          collapsedWidth={collapsedWidth}
          width={expandedWidth}
        >
          <Sidebar />
        </Sider>
        {/* <div className="relative h-full">
        </div> */}
        <Layout
          className="overflow-y-auto my-1"
        >
          <Content
            className="p-3 w-full m-x-auto"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      <Footer className="bg-light py-2">
        <div className="text-center">...footer...</div>
      </Footer>
    </Layout>
  )
}

function AppLayout({ children }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorBgLayout: colors.white,
          colorPrimary: colors.purple['500'],
          colorTextSecondary: colors.gray['500'],
          colorTextLabel: colors.gray['300'],
        },
        components: {
          Layout: {
            headerHeight: 48,
            headerPadding: '4px 16px',
          },
          Form: {
            verticalLabelPadding: '0 0 4px',
          }
        },
      }}
    >
      <AppProvider>
        <App>
          {children}
        </App>
      </AppProvider>
    </ConfigProvider>
  );
}

export default AppLayout;
