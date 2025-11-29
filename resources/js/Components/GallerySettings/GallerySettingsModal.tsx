import { GallerySettingsProvider } from "@/contexts/GallerySettingsContext"
import { UsePageProps } from "@/types/usePage"
import { BankIcon, Cancel01Icon, Key01Icon, Link04Icon, Location03Icon, Settings01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Modal, Tabs } from "antd"
import General from "./General"
import Location from "./Location"
import Members from "./Members"
import { useWindow } from "@/hooks/useWindow"

function GallerySettingsModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  const { current_gallery: gallery } = usePage<UsePageProps>().props
  const { windowWidth } = useWindow()

  function handleClose() {
    setOpen(false)
    router.reload()
  }

  const items = [
    {
      key: 'general',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={Settings01Icon} size={20} />General</div>,
      children: <General />
    },
    {
      key: 'members',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={UserMultipleIcon} size={20} />Members</div>,
      children: <Members />
    },
    {
      key: 'location',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={Location03Icon} size={20} />Location</div>,
      children: <Location />
    },
    {
      key: 'accounting',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={BankIcon} size={20} />Accounting</div>,
      children: <div>Accounting...</div>
    },
    {
      key: 'links',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={Link04Icon} size={20} />Links</div>,
      children: <div>Links...</div>
    },
    {
      key: 'security',
      label: <div className="flex items-center gap-1"><HugeiconsIcon icon={Key01Icon} size={20} />Security</div>,
      children: <div>Security Settings...</div>
    },
  ]

  return (
    <GallerySettingsProvider value={{ open, setOpen, gallery }}>
      <Modal
        title="Gallery Settings"
        open={open}
        onCancel={handleClose}
        closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
        footer={null}
        width={1000}
        okText="Save"
        afterClose={handleClose}
        style={{ top: 50 }}
        >
        <Tabs
          items={items}
          defaultActiveKey="general"
          tabPosition={windowWidth < 768 ? "top" : "left"}
          type="card"
          size="middle"
          className="mt-5 [&_.ant-tabs-content-holder]:border-0"
        />
      </Modal>
    </GallerySettingsProvider>
  )
}

export default GallerySettingsModal
