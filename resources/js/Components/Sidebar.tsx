import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { AuthProps } from "@/types/auth";
import { ArrowTurnBackwardIcon, ContactIcon, DashboardBrowsingIcon, File01Icon, Image02Icon, InvoiceIcon, PresentationLineChart01Icon, Rocket01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Divider, Menu } from "antd";

function Sidebar() {

  const { url, props } = usePage()
  const auth = props.auth as AuthProps
  const user = auth.user
  const { sidebarCollapsed } = useApp()

  const items = [
    { key: 'dashboard', icon: <HugeiconsIcon icon={DashboardBrowsingIcon} />, label: 'Dashboard', route: 'dashboard' },
    { key: 'exhibitions', icon: <HugeiconsIcon icon={PresentationLineChart01Icon} />, label: 'Exhibitions', route: 'exhibitions.index' },
    { key: 'inventory', icon: <HugeiconsIcon icon={Image02Icon} />, label: 'Inventory',
      children: [
        { key: 'artworks', label: 'Artworks', route: 'artworks.index' },
        { key: 'locations', label: 'Locations', route: 'locations.index' },
      ]
    },
    { key: 'invoices', icon: <HugeiconsIcon icon={InvoiceIcon} />, label: 'Sales & Invoices', route: 'invoices.index' },
    { key: 'contacts', icon: <HugeiconsIcon icon={ContactIcon} />, label: 'Contacts', route: 'contacts.index' },
    { key: 'reports', icon: <HugeiconsIcon icon={File01Icon} />, label: 'Reports', route: 'reports.index' },
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
  const flattenItems = () => {
    return allItems.reduce((acc: any[], item: any) => {
      acc.push(item);
      if (item.children) {
        acc = acc.concat(item.children);
      }
      return acc;
    }, []);
  }

  function handleMenuClick(key: string) {
    let selected = flattenItems().find(item => item.key === key);
    if (selected?.route) {
      if (key === 'log-back') {
        router.get(route(selected.route), {}, {
          onSuccess: () => {
            window.location.reload()
          }
        })
      } else {
        router.visit(route(selected.route))
      }
    }
  }

  const activeKey = () => {
    if (url === '/' || url.startsWith('/dashboard')) {
      return 'dashboard';
    }

    return flattenItems().find(item => {
      return item.route && url.includes(item?.route?.split('.')[0])
    })?.key || ''
  }

  return (
    <div
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
        selectedKeys={[activeKey()]}
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
            selectedKeys={[activeKey()]}
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
          className='!border-none'
          onClick={(e) => {
            handleMenuClick(e.key);
          }}
          selectedKeys={[activeKey()]}
        />
      </div>

    </div>
  );
}

export default Sidebar
