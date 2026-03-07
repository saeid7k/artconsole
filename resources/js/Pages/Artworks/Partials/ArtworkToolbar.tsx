import FlexBox from "@/Components/Containers/FlexBox";
import DocumentPreviewDrawer from "@/Components/DocumentPreviewDrawer";
import MoveModal from "@/Components/MoveModal";
import { ARTWORK_DOCUMENTS } from "@/constants/artworkDocuments";
import useFilesUpload from "@/hooks/useFilesUpload";
import { useWindow } from "@/hooks/useWindow";
import { ArtworkProps } from "@/types/artwork";
import { ArrowDataTransferHorizontalIcon, CopyIcon, Delete02Icon, DiplomaIcon, ImageAddIcon, MoreHorizontalCircle01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
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

  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [showCoaPreview, setShowCoaPreview] = useState(false);

  // Upload Images

  const { triggerFilesSelect, FilesInput } = useFilesUpload({
    url: route('artworks.upload-images', { artwork: artwork.id }),
    reloadOnSuccess: true
  });

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

  // Confirm Delete

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Copy Mutation

  const copyMutation = useMutation({
    mutationFn: (artworkId: number) => axios.post(route('artworks.copy', artworkId)),
    onSuccess: (response: any) => {
      message.success('Artwork copied successfully')
      router.visit(route('artworks.show', response.data.artwork_id))
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to copy artwork')
    },
  })

  // Render More Actions Menu

  const renderMoreActionsMenu = () => {
    return (
      <Menu>
        {windowWidth <= 1024 && (
          <>
            <Menu.Item
              key="add-images"
              disabled={!artwork.abilities.update}
              onClick={() => triggerFilesSelect()}
            >
              <FlexBox>
                <HugeiconsIcon icon={ImageAddIcon} size={20} />
                Add Images
              </FlexBox>
            </Menu.Item>
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
          </>
        )}
        <Menu.Item
          key="coa"
          onClick={() => setShowCoaPreview(true)}
        >
          <FlexBox>
            <HugeiconsIcon icon={DiplomaIcon} size={20} />
            Certificate of Authenticity
          </FlexBox>
        </Menu.Item>
        <Menu.Item
          key="copy"
          disabled={!artwork.abilities.create}
          onClick={() => copyMutation.mutate(artwork.id)}
        >
          <FlexBox>
            <HugeiconsIcon icon={CopyIcon} size={20} />
            Copy Artwork
          </FlexBox>
        </Menu.Item>
        {windowWidth <= 1024 && (
          <>
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
          </>
        )}
      </Menu>
    )
  }

  return (
    <>
      <FlexBox>
        {windowWidth > 1024 && (
          <>
            <Tooltip title="Add Images" mouseEnterDelay={0.5} >
              <Button
                type="text"
                shape="square"
                onClick={() => triggerFilesSelect()}
                disabled={!artwork.abilities.update}
              >
                <HugeiconsIcon icon={ImageAddIcon} size={20} />
                {windowWidth >= 1280 && <div>Add Images</div>}
              </Button>
            </Tooltip>
            <Tooltip title="Edit Artwork" mouseEnterDelay={0.5} >
              <Button
                type="text"
                shape="square"
                onClick={() => setShowEditDrawer(true)}
                disabled={!artwork.abilities.update}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
                {windowWidth >= 1280 && <div>Edit</div>}
              </Button>
            </Tooltip>
            <Tooltip title="Move to new Location" mouseEnterDelay={0.5} >
              <Button
                type="text"
                shape="square"
                onClick={() => setOpenMoveModal(true)}
                disabled={!artwork.abilities.update}
              >
                <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={20} />
                {windowWidth >= 1280 && <div>Move</div>}
              </Button>
            </Tooltip>
            <Tooltip title="Delete Artwork" mouseEnterDelay={0.5} >
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
                  {windowWidth >= 1280 && <div>Delete</div>}
                </Button>
              </Popconfirm>
            </Tooltip>
          </>
        )}
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
      </FlexBox>

      {FilesInput}

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

      <DocumentPreviewDrawer
        document={ARTWORK_DOCUMENTS.find(doc => doc.value === 'coa')}
        show={showCoaPreview}
        onClose={() => setShowCoaPreview(false)}
      />
    </>
  )
}

export default ArtworkToolbar;
