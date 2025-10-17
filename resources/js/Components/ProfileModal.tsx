import { AuthProps } from "@/types/auth"
import { getInitials } from "@/utils/stringHelper"
import { Cancel01Icon, Edit03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Avatar, message, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"

function ProfileModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  const { user } = usePage().props.auth as AuthProps

  // Constants and States

  const pictureUploadRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string>(user.photo ?? '')

  // Functions

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
      message.success(res.data.message || "yes Profile photo updated successfully")
      router.reload()
    }).catch((e) => {
      message.error(e.response?.data?.message || "Failed to update profile photo")
    })
  }

  // Effects

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Modal
      title="Profile"
      open={open}
      onCancel={() => setOpen(false)}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      footer={null}
    >
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
              <Avatar size={80} className="text-white">{getInitials(user.full_name)}</Avatar>
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
    </Modal>
  )
}

export default ProfileModal
