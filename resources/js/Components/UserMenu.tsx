import { getInitials } from "@/utils/stringHelper";
import { Logout03Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

function UserMenu() {

  const { user } = usePage().props.auth
  const [openProfileModal, setOpenProfileModal] = useState(false)

  function Popup() {
    return (
      <Menu>
        <div className="flex gap-2 p-2">
          <Avatar size="large" >
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
        <Menu.Divider />
        <Menu.Item key="logout" onClick={() => { }}>
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
        <Button
          shape="circle"
          type="default"
          className="border-0"
        >
          <Avatar size="default" >
            {getInitials(user.full_name)}
          </Avatar>
        </Button>
      </Dropdown>

      <ProfileModal open={openProfileModal} setOpen={setOpenProfileModal} />
    </div>
  )
}

export default UserMenu;
