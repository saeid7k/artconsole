import { AuthProps } from "@/types/auth"
import { usePage } from "@inertiajs/react"
import { Button } from "antd"
import { useState } from "react"
import ChangePasswordModal from "./ChangePasswordModal"

function AccountSecurityTab() {

  const { user } = usePage().props.auth as AuthProps

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <>
      <div
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between">
          <div>
            <strong>Password</strong>
            <div className="text-muted">
              {!user.has_password && (<>You have not set a password yet.</>)}
              {user.has_password && (<>Change your password regularly to keep your account secure.</>)}
            </div>
          </div>
          <div>
            <Button
              onClick={() => setShowPasswordModal(true)}
            >
              {user.has_password ? 'Change Password' : 'Set Password'}
            </Button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        setOpen={setShowPasswordModal}
        action={user.has_password ? 'change' : 'set'}
      />
    </>
  )
}

export default AccountSecurityTab
