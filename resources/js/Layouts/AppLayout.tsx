import LogoBox from "@/Components/LogoBox";
import Sidebar from "@/Components/Sidebar";
import AppProvider, { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { ConfigProvider, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { PropsWithChildren } from "react";

interface AppProps extends PropsWithChildren {
  title?: string|React.ReactNode,
  actionsBar?: React.ReactNode | null,
}

function App ({ title = '', actionsBar = null, children }: AppProps) {
  const { sidebarCollapsed, toggleSidebar } = useApp()
  return (
    <Layout className="min-h-[100vh]">
      <Header
        className="flex items-center bg-light leading-normal"
      >
        <div>
          <LogoBox />
        </div>
      </Header>
      <Layout>
        <Sider
          theme="light"
          className="bg-light"
          collapsed={sidebarCollapsed}
          collapsedWidth={50}
        >
          <Sidebar />
        </Sider>
        <Layout>
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
      <Footer className="bg-light">
        Footer...
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
