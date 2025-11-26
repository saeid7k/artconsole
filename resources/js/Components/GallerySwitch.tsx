import colors from "@/Themes/theme";
import { GalleryProps } from "@/types/gallery";
import { UsePageProps } from "@/types/usePage";
import { AddIcon, AddMaleIcon, ArrowDown01Icon, Cancel01Icon, CheckmarkCircle01Icon, CircleIcon, SettingsFreeIcons, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Badge, Button, Card, Divider, Dropdown, message, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import GalleryAccessTag from "./GalleryAccessTag";
import GalleryAvatar from "./GalleryAvatar";
import GallerySettingsModal from "./GallerySettings/GallerySettingsModal";
import AddMemberModal from "./GallerySettings/AddMemberModal";
import { useApp } from "@/contexts/AppContext";

function GallerySwitch() {

  const { intervalData  } = useApp();

  // Constants & States

  const { current_gallery, galleries } = usePage<UsePageProps>().props;
  const [open, setOpen] = useState(false);
  const isClickedYet = localStorage.getItem('gallerySwitchClicked') == 'true';
  const invitations = intervalData.invitations || []

  // Functions

  function handleClick() {
    localStorage.setItem('gallerySwitchClicked', 'true');
  }

  function switchGallery(galleryId: number) {
    if (galleryId === current_gallery.id) {
      setOpen(false)
      return
    }
    axios.post(route('galleries.set-current'), { gallery_id: galleryId })
      .then(() => {
        message.success('Switched Gallery');
        router.reload()
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to switch gallery');
      })
      .finally(() => {
        setOpen(false);
      });
  }

  // Settings Modal

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Render

  function Popup() {
    return (
      <Card size="small" className="shadow-lg">
        {/* Gallery Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GalleryAvatar gallery={current_gallery} size="large" shadow />
              <div className="flex flex-col leading-tight">
                <div className="text-lg font-semibold">{current_gallery.name}</div>
                <small className="font-light">{current_gallery.members_count} {current_gallery.members_count == 1 ? 'member' : 'members'}</small>
              </div>
            </div>
            <Tooltip title="Gallery Settings" placement="bottom" mouseEnterDelay={1}>
              <Button
                variant="text"
                color="default"
                shape="circle"
                onClick={() => {setShowSettingsModal(true); setOpen(false);}}
              >
                <HugeiconsIcon icon={SettingsFreeIcons} size={20} />
              </Button>
            </Tooltip>
          </div>
          <div className="flex">
            <Button
              size="small"
              icon={<HugeiconsIcon icon={AddMaleIcon} size={16} />}
              className="text-gray-500"
              onClick={() => setShowAddMemberModal(true)}
            >
              invite members
            </Button>
          </div>
        </div>

        <Divider />

        {/* Switch Galleries */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-ghost">Switch Gallery</div>
            <Tooltip title="Create New Gallery" mouseEnterDelay={1}>
              <Button
                size="small"
                icon={<HugeiconsIcon icon={AddIcon} size={16} />}
              />
            </Tooltip>
          </div>
          {galleries.length > 0 && galleries.map((gallery: GalleryProps) => (
            <Button
              key={gallery.id}
              variant="text"
              color="default"
              className="flex justify-start items-center px-1 gap-2"
              onClick={() => switchGallery(gallery.id)}
            >
              <div className="grow-0">
                {gallery.id === current_gallery.id ?
                  (
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color={colors.blue[600]} />
                  ) : (
                    <HugeiconsIcon icon={CircleIcon} size={20} color={colors.gray[600]} />
                  )
                }
              </div>
              <div className="flex items-center gap-1">
                <GalleryAvatar gallery={gallery} size="small" shadow />
                <div>{gallery.name}</div>
                <GalleryAccessTag access={gallery.pivot?.access} className="ms-1" />
              </div>
            </Button>
          ))}
        </div>

        {invitations.length > 0 && (
          <>
            <Divider className="my-3" />

            {/* Invitations */}
            <div className="flex flex-col gap-1">
              <div className="text-ghost tracking-wide">Invitations<Badge status="warning" className="ms-1" /></div>
              {invitations.map((invitation: any) => (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <GalleryAvatar gallery={invitation.gallery} size="small" shadow />
                    <div>{invitation.gallery.name}</div>
                    <GalleryAccessTag access={invitation.settings?.access} className="ms-1" />
                  </div>
                  <div className="flex">
                    <Tooltip title="Join" mouseEnterDelay={1}>
                      <Button
                        type="text"
                        shape="circle"
                      >
                        <HugeiconsIcon icon={Tick02Icon} size={20} className="text-green-600" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Decline" mouseEnterDelay={1}>
                      <Button
                        type="text"
                        shape="circle"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={20} className="text-red-600" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </Card>
    );
  }

  return (
    <>
      <Dropdown
        trigger={['click']}
        popupRender={() => <Popup />}
        onOpenChange={(flag) => setOpen(flag)}
        open={open}
      >
        <Button
          className="flex items-center gap-2 px-1 group"
          variant="text"
          color="default"
          onClick={handleClick}
        >
          <GalleryAvatar gallery={current_gallery} size="small" shadow />
          <div className="flex items-center gap-1">
            <div className="font-semibold" >
              {current_gallery.name}
            </div>
            <Badge status="warning" />
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className={`${isClickedYet ? 'opacity-0' : 'opacity-100'} group-hover:opacity-100 duration-500`}
          />
        </Button>
      </Dropdown>
      <GallerySettingsModal
        open={showSettingsModal}
        setOpen={setShowSettingsModal}
      />
      <AddMemberModal
        open={showAddMemberModal}
        setOpen={setShowAddMemberModal}
        gallery={current_gallery}
      />
    </>
  );
}

export default GallerySwitch
