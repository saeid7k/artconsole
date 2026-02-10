import ARTWORK_STATUSES from "@/constants/artworkStatuses"
import { ArrowDataTransferHorizontalIcon, GeometricShapes01Icon, KeyframesMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { useMutation } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message } from "antd"
import axios from "axios"
import { useState } from "react"
import MoveModal from "../MoveModal"

function ArtworksMassActions({ selectedIds }: { selectedIds: number[] }) {

  const [showMoveModal, setShowMoveModal] = useState(false)

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => axios.post(route('artworks.mass-update-status'), {
      artwork_ids: selectedIds,
      status: status
    }),
    onSuccess: () => {
      message.success('Artworks status updated successfully.')
      router.reload()
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to update artworks status.')
    }
  })

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
              },
              {
                key: 'mass-update-status',
                icon: <HugeiconsIcon icon={GeometricShapes01Icon} size={16} />,
                label: 'Update Status',
                children: (ARTWORK_STATUSES || []).map(status => ({
                  key: status.value,
                  label: status.label,
                  onClick: () => updateStatusMutation.mutate(status.value)
                })),
              }
            ]}
          />
        )}
      >
        <Button
          type={updateStatusMutation.isPending ? "dashed" : "primary"}
          disabled={updateStatusMutation.isPending}
        >
          <HugeiconsIcon icon={KeyframesMultipleIcon} size={20} className={updateStatusMutation.isPending ? "animate-spin" : ""} />
          <div>Mass Actions</div>
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
