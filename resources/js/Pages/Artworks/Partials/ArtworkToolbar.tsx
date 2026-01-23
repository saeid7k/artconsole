import FlexBox from "@/Components/Containers/FlexBox";
import { ArtworkProps } from "@/types/artwork";
import { ArrowDataTransferHorizontalIcon, Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Button, message, Popconfirm, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import ArtworkFormDrawer from "./ArtworkFormDrawer";
import MoveModal from "@/Components/MoveModal";

type Props = {
  artwork: ArtworkProps;
}

function ArtworkToolbar({ artwork }: Props) {

  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false);

  // Delete

  const deleteMutation = useMutation({
    mutationFn: (artworkId: number) => axios.delete(route('artworks.destroy', artworkId)),
    onSuccess: () => {
      message.success('Artwork deleted successfully')
      router.visit(route('artworks.index'))
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete artwork')
    },
  })

  return (
    <>
      <FlexBox>
        <Tooltip title="Edit Artwork" mouseEnterDelay={1} >
          <Button
            type="text"
            shape="square"
            onClick={() => setShowEditDrawer(true)}
            disabled={!artwork.abilities.update}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Move to new Location" mouseEnterDelay={1} >
          <Button
            type="text"
            shape="square"
            onClick={() => setOpenMoveModal(true)}
            disabled={!artwork.abilities.update}
          >
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={20} />
            Move
          </Button>
        </Tooltip>
        <Tooltip title="Delete Artwork" mouseEnterDelay={1} >
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
              type="text"
              shape="square"
              disabled={!artwork.abilities.delete}
            >
              <HugeiconsIcon icon={Delete02Icon} size={20} />
              Delete
            </Button>
          </Popconfirm>
        </Tooltip>
      </FlexBox>

      <ArtworkFormDrawer
        artwork={artwork}
        show={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); router.reload() }}
        mode="update"
      />
      <MoveModal
        open={openMoveModal}
        setOpen={setOpenMoveModal}
      />
    </>
  )
}

export default ArtworkToolbar;
