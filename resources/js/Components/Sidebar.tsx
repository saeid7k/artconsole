import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { ContactIcon, DashboardBrowsingIcon, Image02Icon, InvoiceIcon, PresentationLineChart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Layout, Menu } from "antd";

function Sidebar() {

  const { url } = usePage();
  const { sidebarCollapsed, toggleSidebar } = useApp()

  const items = [
    { key: 'dashboard', icon: <HugeiconsIcon icon={DashboardBrowsingIcon} />, label: 'Dashboard', route: 'dashboard' },
    { key: 'exhibitions', icon: <HugeiconsIcon icon={PresentationLineChart01Icon} />, label: 'Exhibitions', route: 'exhibitions.index' },
    { key: 'artworks', icon: <HugeiconsIcon icon={Image02Icon} />, label: 'Artworks', route: 'artworks.index' },
    { key: 'invoices', icon: <HugeiconsIcon icon={InvoiceIcon} />, label: 'Sales & Invoices', route: 'invoices.index' },
    { key: 'contacts', icon: <HugeiconsIcon icon={ContactIcon} />, label: 'Contacts', route: 'contacts.index' },
  ]

  function handleMenuClick(key: string) {
    let selected = items.find(item => item.key === key);
    if (selected) {
      router.get(route(selected.route))
    }
  }

  const activeKey = items.find(item => {
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
    </Layout>
  );
}

export default Sidebar
