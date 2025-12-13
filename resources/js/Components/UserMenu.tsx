import { getInitials } from "@/utils/stringHelper";
import { Logout03Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import DarkModeSwitch from "./DarkModeSwitch";

function UserMenu() {

  const { user } = usePage().props.auth
  const [openProfileModal, setOpenProfileModal] = useState(false)

  function Popup() {
    return (
      <Menu>
        <div className="flex gap-2 p-2">
          <Avatar size="large" src={user.photo ? user.photo : undefined}>
            {getInitials(user.full_name)}
          </Avatar>
          <div>
            <div className="font-semibold">{user.full_name}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
          </div>
        </div>
        <Menu.Item key="profile" onClick={() => setOpenProfileModal(true)}>
          <div className="flex items-center gap-1"><HugeiconsIcon icon={UserAccountIcon} size={24} />Profile</div>
        </Menu.Item>
        <div className="flex flex-col my-2 px-3">
          <label>Theme</label>
          <DarkModeSwitch />
        </div>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={() => { router.get(route('logout')) }}>
          <div className="flex items-center gap-1"><HugeiconsIcon icon={Logout03Icon} size={24} />Logout</div>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div>
      <Dropdown
        trigger={['click']}
        popupRender={() => <Popup />}
      >
        <Avatar
          size="default"
          src={user.photo ? user.photo : undefined}
          className="cursor-pointer border-2 hover:border-primary transition-all"
        >
          {getInitials(user.full_name)}
        </Avatar>
      </Dropdown>

      <ProfileModal open={openProfileModal} setOpen={setOpenProfileModal} />
    </div>
  )
}

export default UserMenu;
