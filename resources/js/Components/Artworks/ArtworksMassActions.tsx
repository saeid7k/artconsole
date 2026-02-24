import ARTWORK_STATUSES from "@/constants/artworkStatuses"
import { ArrowDataTransferHorizontalIcon, GeometricShapes01Icon, KeyframesMultipleIcon, NoteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { useMutation } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message } from "antd"
import axios from "axios"
import { useState } from "react"
import AnimatedContainer from "../AnimatedContainer"
import MoveModal from "../MoveModal"
import CreateLabelsReportsDrawer from "../Reports/CreateLabelsReportsDrawer"

function ArtworksMassActions({ selectedIds }: { selectedIds: number[] }) {

  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showCreateLabelsReportsDrawer, setShowCreateLabelsReportsDrawer] = useState(false)

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
    <AnimatedContainer type="fadeRight" condition={selectedIds.length > 0} >
      <Dropdown
        trigger={['click']}
        popupRender={() => (
          <Menu
            items={[
              {
                key: 'move',
                icon: <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />,
                label: 'Move to new Location',
                onClick: () => setShowMoveModal(true)
              },
              {
                key: 'update-status',
                icon: <HugeiconsIcon icon={GeometricShapes01Icon} size={16} />,
                label: 'Update Status',
                children: (ARTWORK_STATUSES || []).map(status => ({
                  key: status.value,
                  label: status.label,
                  onClick: () => updateStatusMutation.mutate(status.value)
                })),
              },
              {
                key: 'labels-report',
                icon: <HugeiconsIcon icon={NoteIcon} size={16} />,
                label: 'Create Labels Report',
                onClick: () => setShowCreateLabelsReportsDrawer(true)
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
    </AnimatedContainer>

    {showMoveModal && (
      <MoveModal
        open={showMoveModal}
        setOpen={setShowMoveModal}
        artwork={selectedIds}
      />
    )}

    {showCreateLabelsReportsDrawer && (
      <CreateLabelsReportsDrawer
        show={showCreateLabelsReportsDrawer}
        onClose={() => setShowCreateLabelsReportsDrawer(false)}
        preSelectedArtworkIds={selectedIds}
      />
    )}
  </>)
}

export default ArtworksMassActions
