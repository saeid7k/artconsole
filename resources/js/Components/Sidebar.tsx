import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { AuthProps } from "@/types/auth";
import { GalleryProps } from "@/types/gallery";
import { ArrowTurnBackwardIcon, ContactIcon, CreditCard, CrownIcon, DashboardBrowsingIcon, File01Icon, Image02Icon, InvoiceIcon, PresentationLineChart01Icon, Rocket01Icon, StoreLocation01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Button, Divider, Menu } from "antd";

function Sidebar() {

  const { url, props } = usePage()
  const auth = props.auth as AuthProps
  const user = auth.user
  const gallery = props.current_gallery as GalleryProps
  const { sidebarCollapsed, darkMode, setOpenUpgradeModal } = useApp()

  const items = [
    { key: 'dashboard', icon: <HugeiconsIcon icon={DashboardBrowsingIcon} />, label: 'Dashboard', route: 'dashboard' },
    { key: 'exhibitions', icon: <HugeiconsIcon icon={PresentationLineChart01Icon} />, label: 'Exhibitions', route: 'exhibitions.index' },
    { key: 'artworks', label: 'Artworks Inventory', icon: <HugeiconsIcon icon={Image02Icon} />, route: 'artworks.index' },
    { key: 'locations', label: 'Locations', icon: <HugeiconsIcon icon={StoreLocation01Icon} />, route: 'locations.index' },
    { key: 'invoices', icon: <HugeiconsIcon icon={InvoiceIcon} />, label: 'Sales & Invoices', route: 'invoices.index' },
    { key: 'contacts', icon: <HugeiconsIcon icon={ContactIcon} />, label: 'Contacts', route: 'contacts.index' },
    { key: 'reports', icon: <HugeiconsIcon icon={File01Icon} />, label: 'Reports', route: 'reports.index' },
  ]

  const adminItems = [
    { key: 'users', icon: <HugeiconsIcon icon={UserMultipleIcon} />, label: 'Users', route: 'users.index' },
  ]

  const lowerItems = [
    { key: 'upgrade', icon: <HugeiconsIcon icon={Rocket01Icon} className="animate-pulse" />, label: 'Upgrade' },
    { key: 'subscription', icon: <HugeiconsIcon icon={CreditCard} />, label: 'Subscription', route: 'subscription.index' },
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

  const showUpgrade = gallery?.pivot?.access == 'owner' && !gallery?.is_subscribed
  const showSubscription = gallery?.pivot?.access == 'owner' && gallery?.is_subscribed && !user?.is_demo

  return (
    <div
      style={{
        height: '100%',
        border: '1px solid',
        borderColor: darkMode ? colors.gray['600'] : colors.slate['200'],
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
          <Divider>
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
          className='!border-none'
          onClick={(e) => {
            handleMenuClick(e.key);
          }}
          selectedKeys={[activeKey()]}
        >
          {auth?.is_logged_as && (
            <Menu.Item
              key="log-back"
              title={sidebarCollapsed && "Log Back"}
              icon={<HugeiconsIcon icon={ArrowTurnBackwardIcon} />}
            >
              {!sidebarCollapsed && 'Log Back'}
            </Menu.Item>
          )}

          {showUpgrade && (
            <Menu.Item
              key="upgrade"
              title={sidebarCollapsed && "Upgrade"}
              icon={<HugeiconsIcon icon={CrownIcon} />}
              className="text-blue-600 hover:text-purple-700 rounded-lg moving-bg"
              onClick={() => setOpenUpgradeModal(true)}
            >
              {!sidebarCollapsed && 'Upgrade'}
            </Menu.Item>
          )}
          {showSubscription && (
            <Menu.Item
              key="subscription"
              title={sidebarCollapsed && "Subscription"}
              icon={<HugeiconsIcon icon={CreditCard} />}
            >
              {!sidebarCollapsed && 'Subscription'}
            </Menu.Item>
          )}
        </Menu>

        {user?.is_demo && (
          <div className="px-2">
            <div
              className="flex flex-col gap-1 w-full p-2"
            >
              <div className="text-ghost">You are in demo mode</div>
              <Button
                type="default"
                onClick={() => router.get(route('register'))}
              >
                Register Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar
