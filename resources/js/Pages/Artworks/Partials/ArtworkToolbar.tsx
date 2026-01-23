import FlexBox from "@/Components/Containers/FlexBox";
import MoveModal from "@/Components/MoveModal";
import { useWindow } from "@/hooks/useWindow";
import { ArtworkProps } from "@/types/artwork";
import { ArrowDataTransferHorizontalIcon, Delete02Icon, MoreHorizontalCircle01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal, Popconfirm, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import ArtworkFormDrawer from "./ArtworkFormDrawer";

type Props = {
  artwork: ArtworkProps;
}

function ArtworkToolbar({ artwork }: Props) {

  const { windowWidth } = useWindow();

  // Edit Drawer & Move Modal

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

  // Render More Actions Menu

  const renderMoreActionsMenu = () => {
    return (
      <Menu>
        <Menu.Item
          key="edit"
          disabled={!artwork.abilities.update}
          onClick={() => setShowEditDrawer(true)}
        >
          <FlexBox>
            <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
            Edit Artwork
          </FlexBox>
        </Menu.Item>
        <Menu.Item
          key="move"
          disabled={!artwork.abilities.update}
          onClick={() => setOpenMoveModal(true)}
        >
          <FlexBox>
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={20} />
            Move to new Location
          </FlexBox>
        </Menu.Item>
        <Menu.Item
          key="delete"
          disabled={!artwork.abilities.delete}
          onClick={() => setShowDeleteConfirm(true)}
        >
          <FlexBox>
            <HugeiconsIcon icon={Delete02Icon} size={20} />
            Delete Artwork
          </FlexBox>
        </Menu.Item>
      </Menu>
    )
  }

  // Confirm Delete

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      {windowWidth >= 1024 && (
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
      )}
      {windowWidth < 1024 && (
        <Dropdown
          trigger={['click']}
          placement="bottomLeft"
          popupRender={renderMoreActionsMenu}
        >
          <Button
            type="text"
            shape="circle"
          >
            <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={20} />
          </Button>
        </Dropdown>
      )}

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

      {/* Delete Confirmation Modal */}

      <Modal
        open={showDeleteConfirm}
        title="Delete Artwork"
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={() => {
          deleteMutation.mutate(artwork.id);
          setShowDeleteConfirm(false);
        }}
        okText="Delete"
        okType="danger"
      >
        <div>
          Are you sure you want to delete this artwork?
          <div className="italic text-red-500">{artwork.title}</div>
        </div>
      </Modal>
    </>
  )
}

export default ArtworkToolbar;
