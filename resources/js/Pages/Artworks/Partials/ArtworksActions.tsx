import { ArtworkProps } from "@/types/artwork"
import { Delete02Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { useMutation } from "@tanstack/react-query"
import { Button, message, Popconfirm, Tooltip } from "antd"
import axios from "axios"
import { useState } from "react"
import ArtworkFormDrawer from "./ArtworkFormDrawer"

function ArtworksActions({ artwork }: { artwork: ArtworkProps }) {

  // Edit Drawer

  const [showEditDrawer, setShowEditDrawer] = useState(false)

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
      </div>
      <ArtworkFormDrawer
        artwork={artwork}
        show={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); router.reload() }}
        mode="update"
      />
    </>
  )
}

export default ArtworksActions
