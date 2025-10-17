import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { AuthProps } from "@/types/auth";
import { UserProps } from "@/types/user";
import { ArrowTurnBackwardIcon, ContactIcon, DashboardBrowsingIcon, Image02Icon, InvoiceIcon, Logout03Icon, LogoutCircle01Icon, PresentationLineChart01Icon, Rocket01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Divider, Layout, Menu } from "antd";
import { twMerge } from "tailwind-merge";

function Sidebar() {

  const { url, props } = usePage()
  const auth = props.auth as AuthProps
  const user = auth.user
  const { sidebarCollapsed } = useApp()

  const items = [
    { key: 'dashboard', icon: <HugeiconsIcon icon={DashboardBrowsingIcon} />, label: 'Dashboard', route: 'dashboard' },
    { key: 'exhibitions', icon: <HugeiconsIcon icon={PresentationLineChart01Icon} />, label: 'Exhibitions', route: 'exhibitions.index' },
    { key: 'artworks', icon: <HugeiconsIcon icon={Image02Icon} />, label: 'Artworks', route: 'artworks.index' },
    { key: 'invoices', icon: <HugeiconsIcon icon={InvoiceIcon} />, label: 'Sales & Invoices', route: 'invoices.index' },
    { key: 'contacts', icon: <HugeiconsIcon icon={ContactIcon} />, label: 'Contacts', route: 'contacts.index' },
  ]

  const adminItems = [
    { key: 'users', icon: <HugeiconsIcon icon={UserMultipleIcon} />, label: 'Users', route: 'users.index' },
  ]

  const lowerItems = [
    { key: 'premium', icon: <HugeiconsIcon icon={Rocket01Icon} />, label: 'Premium', route: 'premium' },
  ]

  const logBackItem = { key: 'log-back', icon: <HugeiconsIcon icon={ArrowTurnBackwardIcon} />, label: 'Log Back', route: 'logout-as' }

  if (auth.is_logged_as ?? false) {
    lowerItems.unshift(logBackItem);
  }

  const allItems = [...items, ...adminItems, ...lowerItems];

  function handleMenuClick(key: string) {

    let selected = allItems.find(item => item.key === key);
    if (selected) {
      router.get(route(selected.route))
    }
  }

  const activeKey = allItems.find(item => {
    return url.includes(item.route.split('.')[0])
  })?.key || 'dashboard'

  return (
    <Layout
      style={{
        height: '100%',
        border: '1px solid',
        borderColor: colors.slate['200'],
        borderWidth: '0 1px 0 0',
        width: '100%',
        position: 'relative',
      }}
    >
      <Menu
        mode="inline"
        inlineCollapsed={sidebarCollapsed}
        items={items}
        className="pt-10 !border-none"
        onClick={(e) => {
          handleMenuClick(e.key);
        }}
        selectedKeys={[activeKey]}
      />

      {user?.is_admin && (
        <>
          <Divider className="!border-gray-200" >
            {!sidebarCollapsed && (
              <div className="text-sm font-light">Admin Area</div>
            )}
          </Divider>

          <Menu
            mode="inline"
            inlineCollapsed={sidebarCollapsed}
            items={adminItems}
            className="!border-none"
            onClick={(e) => {
              handleMenuClick(e.key);
            }}
            selectedKeys={[activeKey]}
          />
        </>
      )}

      <div
        className="absolute bottom-0 w-full"
      >
        <Menu
          mode="inline"
          inlineCollapsed={sidebarCollapsed}
          items={lowerItems}
          className={twMerge("!border-0 mb-2 rounded-lg bg-blue-100 [&_li]:!text-blue-700",
            !sidebarCollapsed && '!shadow-md shadow-black w-[90%] mx-auto'
          )}
          onClick={(e) => {
            handleMenuClick(e.key);
          }}
          selectedKeys={[activeKey]}
        />
      </div>

    </Layout>
  );
}

export default Sidebar
