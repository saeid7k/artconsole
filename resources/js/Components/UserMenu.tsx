import { getInitials } from "@/utils/stringHelper";
import { Logout03Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Avatar, Dropdown, Menu } from "antd";
import { useState } from "react";
import AccountModal from "./Account/AccountModal";
import DarkModeSwitch from "./DarkModeSwitch";

function UserMenu() {

  const { user } = usePage().props.auth
  const [openAccountModal, setOpenAccountModal] = useState(false)

  function Popup() {
    const menuItems = [
      {
        key: 'user-info',
        label: (
          <div className="flex gap-2 cursor-default">
            <Avatar size="large" src={user?.photo_small ?? undefined}>
              {getInitials(user?.full_name ?? "")}
            </Avatar>
            <div>
              <div className="font-semibold text-body">{user?.full_name}</div>
              <div className="text-sm text-slate-500">{user?.email}</div>
            </div>
          </div>
        ),
        disabled: true,
      },
      {
        key: 'account',
        label: (
          <div className="flex items-center gap-1"><HugeiconsIcon icon={UserAccountIcon} size={24} />Account</div>
        ),
        onClick: () => setOpenAccountModal(true),
      },
      {
        key: 'theme',
        label: (
          <div className="flex flex-col cursor-default">
            <label>Theme</label>
            <DarkModeSwitch />
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        label: (
          <div className="flex items-center gap-1"><HugeiconsIcon icon={Logout03Icon} size={24} />Logout</div>
        ),
        onClick: () => router.get(route('logout')),
      },
    ]

    return <Menu items={menuItems} />
  }

  return (
    <div>
      <Dropdown
        trigger={['click']}
        popupRender={() => <Popup />}
      >
        <Avatar
          size="default"
          src={user?.photo_small ?? undefined}
          className="cursor-pointer border-2 hover:border-primary transition-all"
        >
          {getInitials(user?.full_name ?? "")}
        </Avatar>
      </Dropdown>

      <AccountModal open={openAccountModal} setOpen={setOpenAccountModal} />
    </div>
  )
}

export default UserMenu;
