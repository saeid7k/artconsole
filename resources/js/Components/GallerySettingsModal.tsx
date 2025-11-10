import { GallerySettingsProvider } from "@/contexts/GallerySettingsContext"
import { UsePageProps } from "@/types/usePage"
import { Cancel01Icon, Key01Icon, Settings01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Modal, Tabs } from "antd"
import General from "./GallerySettings/General"

function GallerySettingsModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  const { current_gallery: gallery } = usePage<UsePageProps>().props

  function handleClose() {
    setOpen(false)
    router.reload()
  }

  return (
    <GallerySettingsProvider value={{ open, setOpen, gallery }}>
      <Modal
        title="Gallery Settings"
        open={open}
        onCancel={handleClose}
        closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
        footer={null}
        width={800}
        okText="Save"
        afterClose={handleClose}
      >
        <Tabs
          defaultActiveKey="general"
          tabPosition="left"
          type="card"
          size="middle"
          className="mt-5 [&_.ant-tabs-content-holder]:border-0"
        >
          <Tabs.TabPane
            key="general"
            tab={
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Settings01Icon} size={16} />
                General
              </div>
            }
          >
            <General />
          </Tabs.TabPane>
          <Tabs.TabPane
            key="members"
            tab={
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
                Members
              </div>
            }
          >
            <div>Members</div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key="security"
            tab={
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Key01Icon} size={16} />
                Security
              </div>
            }
          >
            <div>Security Settings</div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </GallerySettingsProvider>
  )
}

export default GallerySettingsModal
