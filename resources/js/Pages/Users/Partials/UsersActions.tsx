import { UserProps } from "@/types/user"
import { Delete02Icon, Login01Icon, SidebarRightIcon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, message, Popconfirm, Tooltip } from "antd"
import axios from "axios"

function UsersActions({ user }: { user: UserProps }) {

  function confirmDelete() {
    axios.post(route('users.delete', user.id))
      .then((res) => {
        message.success(res.data.message || 'User deleted successfully')
        router.reload()
      })
      .catch((e) => {
        message.error(e.response?.data?.message || 'An error occurred while deleting the user')
      })
  }

  return (
    <div
      className="flex items-center gap-1"
    >
      <Tooltip title="Login as User">
        <Button
          variant="text"
          color='purple'
          shape="circle"
          icon={<HugeiconsIcon icon={Login01Icon} size={20} />}
          onClick={() => router.visit(route('login-as', user.id))}
        />
      </Tooltip>
      <Tooltip title="View Details">
        <Button
          variant="text"
          color='blue'
          shape="circle"
          icon={<HugeiconsIcon icon={SidebarRightIcon} size={20} />}
          onClick={() => router.visit(route('user.show', user.id))}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Popconfirm
          title="Delete the user"
          description="Are you sure to delete this user?"
          onConfirm={() => confirmDelete()}
          okText="Yes"
          cancelText="No"
          placement="left"
          okType="danger"
        >
          <Button
            variant="text"
            color='danger'
            shape="circle"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            disabled={!user.abilities.delete}
          />
        </Popconfirm>
      </Tooltip>
    </div>
  )
}

export default UsersActions
