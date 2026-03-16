import GallerySwitch from "@/Components/Galleries/GallerySwitch";
import ServerFlashMessage from "@/Components/ServerFlashMessage";
import Sidebar from "@/Components/Sidebar";
import TopbarActions from "@/Components/TopbarActions";
import AppProvider, { useApp } from "@/contexts/AppContext";
import { useWindow } from "@/hooks/useWindow";
import colors from "@/Themes/theme";
import { ArrowLeftDoubleFreeIcons, ArrowRightDoubleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { PropsWithChildren, useEffect } from "react";

interface AppProps extends PropsWithChildren {
  title?: string|React.ReactNode,
  actionsBar?: React.ReactNode | null,
}

function App ({ children }: AppProps) {

  const { sidebarCollapsed, toggleSidebar, darkMode } = useApp()
  const { scrollY, windowWidth } = useWindow()
  const collapsedWidth = 50
  const expandedWidth = 200

  useEffect(() => {
    if (windowWidth < 768 && !sidebarCollapsed) {
      toggleSidebar()
    } else if (windowWidth >= 768 && sidebarCollapsed) {
      toggleSidebar()
    }
  }, [windowWidth])

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorText: darkMode ? colors.gray['200'] : colors.gray['800'],
          colorPrimary: darkMode ? colors.purple['400'] : colors.purple['500'],
          colorTextSecondary: colors.gray['500'],
          colorTextLabel: colors.gray['300'],
          colorBgBase: darkMode ? colors.neutral['950'] : colors.gray['50'],
          colorBgLayout: darkMode ? colors.gray['900'] : colors.gray['50'],
          colorBgContainer: darkMode ? colors.gray['900'] : colors.white,
          colorBgElevated: darkMode ? colors.gray['900'] : colors.white,
          colorLinkHover: darkMode ? colors.blue['300'] : colors.blue['500'],
          // boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.9)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
          boxShadowSecondary: darkMode ? '0 6px 16px 4px rgba(0, 0, 0, 0.9)' : '0 6px 16px 4px rgba(0, 0, 0, 0.1)',
          fontFamily: `'Segoe UI', sans-serif`,
        },
        components: {
          Layout: {
            headerHeight: 48,
            headerPadding: '4px 16px',
            headerBg: darkMode ? colors.gray['800'] : colors.primary['50'],
            siderBg: darkMode ? colors.gray['800'] : colors.primary['50'],
            footerBg: darkMode ? colors.gray['800'] : colors.primary['50'],
          },
          Menu: {
            colorBgContainer: darkMode ? colors.gray['800'] : colors.primary['50'],
            itemActiveBg: darkMode ? colors.primary['800'] : colors.primary['100'],
            itemSelectedBg: darkMode ? colors.primary['800'] : colors.primary['100'],
            itemSelectedColor: darkMode ? colors.white : colors.primary['700'],
          },
          Form: {
            verticalLabelPadding: '0 0 4px',
          },
          Segmented: {
            trackBg: darkMode ? colors.gray['800'] : colors.gray['200'],
          }
        },
      }}
    >
      <QueryClientProvider client={new QueryClient()} >
        <Layout className="fixed w-full h-full">
          <Header
            className={`flex justify-between items-center leading-normal sticky top-0 z-10 w-full transition-all ${
              scrollY > 0 ? ' shadow-md' : ''
            }`}
          >
            <div>
              <GallerySwitch />
            </div>
            <TopbarActions />
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
              // theme="light"
              className="h-full overflow-y-auto overflow-x-visible"
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
                className="p-3 w-full m-x-auto min-h-max"
              >
                {children}
              </Content>
            </Layout>
          </Layout>
          <Footer className="py-2">
            <div className="text-center">...footer...</div>
          </Footer>
        </Layout>
      </QueryClientProvider>
      <ServerFlashMessage />
    </ConfigProvider>
  )
}

function AppLayout({ children }: AppProps) {
  return (
      <AppProvider>
        <App>
          {children}
        </App>
      </AppProvider>
  );
}

export default AppLayout;
