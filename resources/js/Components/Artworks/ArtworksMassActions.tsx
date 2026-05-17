import ARTWORK_STATUSES from "@/constants/artworkStatuses"
import { ArrowDataTransferHorizontalIcon, GeometricShapes01Icon, KeyframesMultipleIcon, LayoutTable02Icon, NoteIcon, SaveMoneyDollarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { useMutation } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message } from "antd"
import axios from "axios"
import { useState } from "react"
import AnimatedContainer from "../AnimatedContainer"
import InvoiceFormDrawer from "../Invoices/InvoiceFormDrawer"
import MoveModal from "../MoveModal"
import CreateInventoryReportDrawer from "../Reports/CreateInventoryReportDrawer"
import CreateLabelsReportsDrawer from "../Reports/CreateLabelsReportsDrawer"

function ArtworksMassActions({ selectedIds }: { selectedIds: number[] }) {

  const user = usePage().props.auth.user

  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showCreateLabelsReportsDrawer, setShowCreateLabelsReportsDrawer] = useState(false)
  const [showCreateInventoryReportsDrawer, setShowCreateInventoryReportsDrawer] = useState(false)
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false)

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

  const showTriggerButton = selectedIds.length > 0 && !!user?.has_edit_access;

  return (<>
    <AnimatedContainer type="fadeRight" condition={showTriggerButton} >
      <Dropdown
        trigger={['click']}
        popupRender={() => (
          <Menu
            items={[
              {
                key: 'move',
                icon: <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />,
                label: 'Move to new Location',
                onClick: () => setShowMoveModal(true),
                disabled: !user?.has_edit_access
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
                disabled: !user?.has_edit_access
              },
              {
                key: 'divider-reports',
                type: 'divider',
              },
              {
                key: 'sell',
                icon: <HugeiconsIcon icon={SaveMoneyDollarIcon} size={16} />,
                label: <div>Sell <span className="text-ghost">(Create Invoice)</span></div>,
                onClick: () => setShowInvoiceDrawer(true),
                disabled: !user?.has_edit_access
              },
              {
                key: 'divider-reports',
                type: 'divider',
              },
              {
                key: 'labels-report',
                icon: <HugeiconsIcon icon={NoteIcon} size={16} />,
                label: 'Create Labels Report',
                onClick: () => setShowCreateLabelsReportsDrawer(true),
                disabled: !user?.has_edit_access
              },
              {
                key: 'inventory-report',
                icon: <HugeiconsIcon icon={LayoutTable02Icon} size={16} />,
                label: 'Create Inventory Report',
                onClick: () => setShowCreateInventoryReportsDrawer(true),
                disabled: !user?.has_edit_access
              },
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

    {showCreateInventoryReportsDrawer && (
      <CreateInventoryReportDrawer
        show={showCreateInventoryReportsDrawer}
        onClose={() => setShowCreateInventoryReportsDrawer(false)}
        preSelectedArtworkIds={selectedIds}
      />
    )}

    <InvoiceFormDrawer
      show={showInvoiceDrawer}
      onClose={() => setShowInvoiceDrawer(false)}
      selectedArtworksIds={selectedIds}
    />
  </>)
}

export default ArtworksMassActions
