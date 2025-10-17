import React, { useEffect, useRef, useState } from "react"
import { Cancel01Icon, CancelSquareIcon, Edit03Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Modal } from "antd"

function ProfileModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const picture = "https://www.corporatephotographerslondon.com/wp-content/uploads/2021/07/LinkedIn_profile_photo_sample_3-300x300.jpg"
  const pictureUploadRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string>(picture)

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
      title="Profile"
      open={open}
      onCancel={() => setOpen(false)}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      footer={null}
    >
      <div className="">
        {/* hidden file input triggered by the overlay */}
        <input
          ref={pictureUploadRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="relative w-20 h-20 ratio-square rounded-full overflow-hidden m-auto">
          <img
            src={preview}
            alt="Profile Photo"
            className="w-full h-full object-cover"
          />
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
