import { ArrowDataTransferHorizontalIcon, KeyframesMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Dropdown, Menu } from "antd"
import { useState } from "react"
import MoveModal from "../MoveModal"

function ArtworksMassActions({ selectedIds }: { selectedIds: number[] }) {

  const [showMoveModal, setShowMoveModal] = useState(false)

  return (<>
    {selectedIds.length > 0 && (
      <Dropdown
        trigger={['click']}
        popupRender={() => (
          <Menu
            items={[
              {
                key: 'mass-move',
                icon: <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />,
                label: 'Move to new Location',
                onClick: () => setShowMoveModal(true)
              }
            ]}
          />
        )}
      >
        <Button
          type="primary"
        >
          <HugeiconsIcon icon={KeyframesMultipleIcon} size={20} />
          Mass Actions
        </Button>
      </Dropdown>
    )}

    <MoveModal
      open={showMoveModal}
      setOpen={setShowMoveModal}
      artwork={selectedIds}
    />
  </>)
}

export default ArtworksMassActions
