import LogoBox from "@/Components/LogoBox";
import Sidebar from "@/Components/Sidebar";
import AppProvider, { useApp } from "@/contexts/AppContext";
import { useWindow } from "@/hooks/useWindow";
import colors from "@/Themes/theme";
import { ArrowLeftDoubleFreeIcons, ArrowRightDoubleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, ConfigProvider, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { PropsWithChildren } from "react";

interface AppProps extends PropsWithChildren {
  title?: string|React.ReactNode,
  actionsBar?: React.ReactNode | null,
}

function App ({ title = '', actionsBar = null, children }: AppProps) {

  const { sidebarCollapsed, toggleSidebar } = useApp()
  const { scrollY } = useWindow()
  const collapsedWidth = 50
  const expandedWidth = 200

  return (
    <Layout className="fixed w-full h-full">
      <Header
        className={`flex items-center bg-light leading-normal px-5 sticky top-0 z-10 w-full transition-all ${
          scrollY > 0 ? ' shadow-md' : ''
        }`}
      >
        <div>
          <LogoBox />
        </div>
      </Header>
      <Layout className="relative">
        <Button
          shape="circle"
          type="default"
          className={`absolute top-2 z-10 ${sidebarCollapsed ? `left-[${collapsedWidth - 16}px]` : `left-[${expandedWidth - 16}px]`}`}
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
            className="flex items-center justify-between px-6 py-3 w-full h-12 grow-0"
          >
            <h3 className="m-0">{title}</h3>
            {actionsBar && <div>{actionsBar}</div>}
          </Content>
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

function AppLayout({ title = '', actionsBar = null, children }: AppProps) {
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
      <AppProvider>
        <App title={title} actionsBar={actionsBar}>
          {children}
        </App>
      </AppProvider>
    </ConfigProvider>
  );
}

export default AppLayout;
