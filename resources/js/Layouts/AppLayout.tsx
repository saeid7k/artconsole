import GallerySwitch from "@/Components/Galleries/GallerySwitch";
import ServerFlashMessage from "@/Components/ServerFlashMessage";
import Sidebar from "@/Components/Sidebar";
import SelectPlanModal from "@/Components/Subscription/SelectPlanModal";
import TopbarActions from "@/Components/TopbarActions";
import AppProvider, { useApp } from "@/contexts/AppContext";
import { useWindow } from "@/hooks/useWindow";
import colors from "@/Themes/theme";
import { oklchToHex } from "@/utils/colorHelper";
import { StyleProvider } from '@ant-design/cssinjs';
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

  const { sidebarCollapsed, toggleSidebar, darkMode, openUpgradeModal, setOpenUpgradeModal } = useApp()
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
    <StyleProvider layer >
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorText: darkMode ? oklchToHex(colors.gray['200']) : oklchToHex(colors.gray['800']),
            colorPrimary: darkMode ? colors.primary['400'] : colors.primary['500'],
            colorTextSecondary: oklchToHex(colors.gray['500']),
            colorTextLabel: oklchToHex(colors.gray['300']),
            colorBgBase: darkMode ? oklchToHex(colors.neutral['950']) : oklchToHex(colors.gray['50']),
            colorBgLayout: darkMode ? oklchToHex(colors.gray['900']) : oklchToHex(colors.gray['50']),
            colorBgContainer: darkMode ? oklchToHex(colors.gray['900']) : colors.white,
            colorBgElevated: darkMode ? oklchToHex(colors.gray['900']) : colors.white,
            colorLink: darkMode ? oklchToHex(colors.blue['400']) : oklchToHex(colors.blue['500']),
            colorLinkHover: darkMode ? oklchToHex(colors.blue['300']) : oklchToHex(colors.blue['600']),
            colorBorder: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['300']),
            colorBorderSecondary: darkMode ? oklchToHex(colors.gray['600']) : oklchToHex(colors.gray['200']),
            colorBorderDisabled: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['300']),
            colorSplit: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['200']),
            boxShadowSecondary: darkMode ? '0 6px 16px 4px rgba(0, 0, 0, 0.9)' : '0 6px 16px 4px rgba(0, 0, 0, 0.1)',
            fontFamily: `'Segoe UI', sans-serif`,
            blue: oklchToHex(colors.blue[500]),
            purple: oklchToHex(colors.purple[500]),
            cyan: oklchToHex(colors.cyan[500]),
            green: oklchToHex(colors.green[500]),
            pink: oklchToHex(colors.pink[500]),
            red: oklchToHex(colors.red[500]),
            orange: oklchToHex(colors.orange[500]),
            yellow: oklchToHex(colors.yellow[500]),
            lime: oklchToHex(colors.lime[500]),
          },
          components: {
            Layout: {
              headerHeight: 48,
              headerPadding: '4px 16px',
              headerBg: darkMode ? oklchToHex(colors.gray['800']) : colors.primary['50'],
              siderBg: darkMode ? oklchToHex(colors.gray['800']) : colors.primary['50'],
              footerBg: darkMode ? oklchToHex(colors.gray['800']) : colors.primary['50'],
            },
            Menu: {
              colorBgContainer: darkMode ? oklchToHex(colors.gray['800']) : colors.primary['50'],
              itemActiveBg: darkMode ? colors.primary['800'] : colors.primary['100'],
              itemSelectedBg: darkMode ? colors.primary['800'] : colors.primary['100'],
              itemSelectedColor: darkMode ? colors.white : colors.primary['700'],
              subMenuItemSelectedColor: darkMode ? colors.primary['300'] : colors.primary['700'],
            },
            Form: {
              verticalLabelPadding: '0 0 4px',
            },
            Segmented: {
              trackBg: darkMode ? oklchToHex(colors.gray['800']) : oklchToHex(colors.gray['200']),
            },
            Table: {
              borderColor: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['200']),
              headerSplitColor: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['300']),
            },
            Card: {
              colorBorder: darkMode ? oklchToHex(colors.gray['700']) : oklchToHex(colors.gray['300']),
            },
            Pagination: {
              colorLink: darkMode ? colors.primary['400'] : colors.primary['500'],
              colorLinkHover: darkMode ? colors.primary['300'] : colors.primary['600'],
            },
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
                className="h-full overflow-y-auto overflow-x-visible"
                collapsed={sidebarCollapsed}
                collapsedWidth={collapsedWidth}
                width={expandedWidth}
              >
                <Sidebar />
              </Sider>
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

          <SelectPlanModal
            open={openUpgradeModal}
            onClose={() => setOpenUpgradeModal(false)}
          />
        </QueryClientProvider>
        <ServerFlashMessage />
      </ConfigProvider>
    </StyleProvider>
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
