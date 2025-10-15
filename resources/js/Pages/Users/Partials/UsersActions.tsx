import { UserProps } from "@/types/user"
import { Delete02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Tooltip } from "antd"

function UsersActions({ user }: { user: UserProps })
{
    return (
        <div
          className="flex items-center gap-1"
        >
          <Tooltip title="Contact Card">
            <Button
              variant="text"
              color='blue'
              shape="circle"
              icon={<HugeiconsIcon icon={ViewIcon} size={20} />}
              onClick={() => router.visit(route('user.show', user.id))}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              variant="text"
              color='danger'
              shape="circle"
              icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
              onClick={() => router.post(route('users.remove', user.id))}
              // disabled={!user.abilities.delete}
            />
          </Tooltip>
        </div>
    )
}

export default UsersActions
