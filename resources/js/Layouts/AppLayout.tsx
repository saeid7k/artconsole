import LogoBox from "@/Components/LogoBox";
import Sidebar from "@/Components/Sidebar";
import AppProvider, { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { ConfigProvider, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { PropsWithChildren } from "react";

interface AppProps extends PropsWithChildren {
  title?: string
}

function App ({ title = '', children }: AppProps) {
  const { sidebarCollapsed, toggleSidebar } = useApp()
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
              className="px-6 py-3 w-full h-12 grow-0"
            >
              <h3
                className="m-0"
              >{title}</h3>
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
    </ConfigProvider>
  )
}

function AppLayout({ title = '', children }: AppProps) {
  return (
    <AppProvider>
      <App title={title} >
        {children}
      </App>
    </AppProvider>
  );
}

export default AppLayout;
