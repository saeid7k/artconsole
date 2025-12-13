import { ArtworkProps } from "@/types/artwork"
import { Delete02Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Popconfirm, Tooltip } from "antd"

function ArtworksActions({ artwork }: { artwork: ArtworkProps }) {

  // function handleDelete() {
  //   axios.post(route('artworks.delete', artwork.id))
  //     .then((res) => {
  //       message.success(res.data.message || 'Artwork deleted successfully')
  //       router.reload()
  //     })
  //     .catch((e) => {
  //       message.error(e.response?.data?.message || 'An error occurred while deleting the artwork')
  //     })
  // }

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
            // onClick={() => setShowEditDrawer(true)}
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
            // onConfirm={() => handleDelete()}
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
    </>
  )
}

export default ArtworksActions
