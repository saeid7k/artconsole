import { ProfileProvider } from "@/contexts/ProfileContext"
import { AuthProps } from "@/types/auth"
import { getInitials } from "@/utils/stringHelper"
import { Cancel01Icon, Edit03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Avatar, message, Modal, Tabs } from "antd"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import AccountPersonalTab from "./AccountPersonalTab"
import AccountSecurityTab from "./AccountSecurityTab"
import AccountPreferencesTab from "./AccountPreferencesTab"

function AccountModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  // Hooks

  const { user } = usePage().props.auth as AuthProps

  // Constants and States

  const pictureUploadRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string>(user?.photo ?? '')
  const [profileTriggerCounter, setProfileTriggerCounter] = useState(0)

  const tabItems = [
    {
      key: 'personal',
      label: 'Personal',
      children: <AccountPersonalTab />
    },
    {
      key: 'preferences',
      label: 'Preferences',
      children: <AccountPreferencesTab />
    },
    {
      key: 'security',
      label: 'Security',
      children: <AccountSecurityTab />
    }
  ]

  function handleClose() {
    setProfileTriggerCounter(prev => prev + 1)
    setOpen(false)
  }

  useEffect(() => {
    setProfileTriggerCounter(prev => prev + 1)
  }, [open])

  // Photo Handling

  const handleOverlayClick = () => {
    pictureUploadRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    // Revoke previous blob URL if it was one
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
    setPreview(url)

    let form = new FormData()
    form.append('photo', file)

    axios.post(route('profile.update-photo'), form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      message.success(res.data.message || "Profile photo updated successfully")
      router.reload()
    }).catch((e) => {
      message.error(e.response?.data?.message || "Failed to update profile photo")
    })
  }

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Modal
      title="Account Settings"
      open={open}
      onCancel={handleClose}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      footer={null}
      width={800}
      afterClose={handleClose}
      // afterOpenChange={() => form.resetFields()}
    >
      <ProfileProvider value={{ profileTriggerCounter }}>
        {/* Photo */}

        <div className="">
          <input
            ref={pictureUploadRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="relative w-20 h-20 ratio-square rounded-full overflow-hidden m-auto">
            {preview ? (
              <img
                src={preview}
                alt="Profile Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 grid place-content-center">
                <Avatar size={80} className="text-white">{getInitials(user?.full_name ?? '')}</Avatar>
              </div>
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={handleOverlayClick}
              className="bg-black text-white opacity-0 w-full h-full absolute top-0 left-0 hover:opacity-50 cursor-pointer grid place-content-center transition-all"
            >
              <HugeiconsIcon icon={Edit03Icon} size={32} />
            </div>
          </div>
        </div>

        {/* Fields */}

        <Tabs
          items={tabItems}
        />
      </ProfileProvider>
    </Modal>
  )
}

export default AccountModal
