import DocumentPreviewDrawer from "@/Components/DocumentPreviewDrawer"
import MoveModal from "@/Components/MoveModal"
import { ARTWORK_DOCUMENTS } from "@/constants/artworkDocuments"
import { ArtworkProps } from "@/types/artwork"
import { ArrowDataTransferHorizontalIcon, Copy01Icon, Delete02Icon, DiplomaIcon, MoreHorizontalCircle01Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { useMutation } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message, Popconfirm, Tooltip } from "antd"
import axios from "axios"
import { useState } from "react"
import ArtworkFormDrawer from "./ArtworkFormDrawer"

function ArtworksActions({ artwork }: { artwork: ArtworkProps }) {

  // Edit Drawer

  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [showCoaPreview, setShowCoaPreview] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (artworkId: number) => axios.delete(route('artworks.destroy', artworkId)),
    onSuccess: () => {
      message.success('Artwork deleted successfully')
      router.reload()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete artwork')
    },
  })

  // Copy Mutation

  const copyMutation = useMutation({
    mutationFn: (artworkId: number) => axios.post(route('artworks.copy', artworkId)),
    onSuccess: () => {
      message.success('Artwork copied successfully')
      router.reload()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to copy artwork')
    },
  })

  // Move Modal

  const [openMoveModal, setOpenMoveModal] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-1"
      >
        <Tooltip title="View Artwork">
          <Button
            variant="text"
            color='blue'
            shape="circle"
            icon={<HugeiconsIcon icon={ViewIcon} size={20} />}
            onClick={() => router.get(route('artworks.show', artwork.id))}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={PencilEdit02Icon} size={20} />}
            onClick={() => setShowEditDrawer(true)}
            disabled={!artwork.abilities.update}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title="Delete the artwork"
            description={
              <div>
                Are you sure to delete this artwork?
                <div className="italic text-red-500">{artwork.title}</div>
              </div>
            }
            onConfirm={() => deleteMutation.mutate(artwork.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
            okType="danger"
          >
            <Button
              variant="text"
              color='danger'
              shape="circle"
              icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
              disabled={!artwork.abilities.delete}
            />
          </Popconfirm>
        </Tooltip>
        <Dropdown
          trigger={['click']}
          popupRender={() =>
            <Menu
              items={[
                {
                  key: 'move',
                  icon: <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />,
                  label: 'Move to new Location',
                  disabled: !artwork.abilities.update,
                  onClick: () => setOpenMoveModal(true),
                },
                {
                  key: 'coa',
                  icon: <HugeiconsIcon icon={DiplomaIcon} size={16} />,
                  label: 'Certificate of Authenticity',
                  onClick: () => setShowCoaPreview(true),
                },
                {
                  key: 'copy',
                  icon: <HugeiconsIcon icon={Copy01Icon} size={16} />,
                  label: 'Copy Artwork',
                  disabled: !artwork.abilities.update,
                  onClick: () => copyMutation.mutate(artwork.id),
                },
              ]}
            />
          }
        >
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={20} />}
            disabled={!artwork.abilities.update}
          />
        </Dropdown>
      </div>

      {/* Child Components */}

      <ArtworkFormDrawer
        artwork={artwork}
        show={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); router.reload() }}
        mode="update"
      />
      <MoveModal
        open={openMoveModal}
        setOpen={setOpenMoveModal}
        artwork={artwork}
      />
      <DocumentPreviewDrawer
        artwork={artwork}
        show={showCoaPreview}
        onClose={() => setShowCoaPreview(false)}
        document={ARTWORK_DOCUMENTS.find(doc => doc.value === 'coa')}
      />
    </>
  )
}

export default ArtworksActions
