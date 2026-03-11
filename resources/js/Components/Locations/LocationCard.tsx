import { LocationProps } from "@/types/location";
import { Delete02Icon, Image02Icon, LayoutTable02Icon, Location01Icon, MoreHorizontalSquare01Icon, NoteIcon, PencilEdit02Icon, StarIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Button, Card, Divider, Dropdown, Menu, message, notification, Popconfirm, Tag, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import GoogleMap from "../GoogleMap";
import ImageGroup from "../ImageGroup";
import CreateInventoryReportDrawer from "../Reports/CreateInventoryReportDrawer";
import CreateLabelsReportsDrawer from "../Reports/CreateLabelsReportsDrawer";
import TextboxExpandable from "../TextboxExpandable";
import LocationCreateEditModal from "./LocationCreateEditModal";

function LocationCard({ location }: { location: LocationProps }) {

  const user = usePage().props.auth.user;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [showCreateLabelsReportModal, setShowCreateLabelsReportModal] = useState(false);
  const [showCreateInventoryReportModal, setShowCreateInventoryReportModal] = useState(false);

  function handleSetAsPrimary() {
    axios.post(route('locations.set-primary'), {
      location_id: location.id,
    }).then(() => {
      message.success('Location set as primary');
      router.reload({ only: ['locations']})
    }).catch((error) => {
      message.error(error.response?.data?.message || 'Failed to set location as primary');
    });
  }

  function handleDelete() {
    if (location.artworks_count > 0) {
      notificationApi.error({
        title: 'Cannot Delete Location with Artworks',
        description: 'This location has artworks associated with it. Please move or delete the artworks before deleting this location.',
        duration: 10,
        showProgress: true,
      });
      return;
    }
    axios.delete(route('locations.destroy', location.id))
      .then(() => {
        message.success('Location deleted successfully');
        router.reload({ only: ['locations']});
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to delete location');
      });
  }

  function handleToggleActive() {
    axios.post(route('locations.toggle-active'), {
      location_id: location.id,
    }).then(() => {
      message.success(`Location ${location.is_active ? 'deactivated' : 'activated'} successfully`);
      router.reload({ only: ['locations']})
    }).catch((error) => {
      message.error(error.response?.data?.message || 'Failed to toggle location active status');
    });
  }

  return (
    <>
      <Card
        title={
          <FlexBox justifyContent="between" gap={3} >
            <div>{location.name}</div>
            {location.is_primary && (
              <Tag color="blue">Primary</Tag>
            )}
            {!location.is_primary && location.is_active && (
              <Button
                size="small"
                variant="filled"
                color="default"
                className="opacity-0 group-hover:opacity-100"
                onClick={handleSetAsPrimary}
              >
                Set as Primary
              </Button>
            )}
          </FlexBox>
        }
        className={twMerge(
          "w-full group overflow-hidden",
          location.is_primary ? 'border-blue-500/50' : '',
          location.is_active ? '' : 'bg-soft'
        )}
        actions={[
          <Tooltip title="Edit" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="default"
              shape="circle"
              onClick={() => setOpenEditModal(true)}
              disabled={!location.abilities.update}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
            </Button>
          </Tooltip>,
          <Tooltip title="Delete" placement="bottom" mouseEnterDelay={1} >
            <Popconfirm
              title="Are you sure to delete this location?"
              placement="bottom"
              okType="danger"
              okText="Yes"
              onConfirm={handleDelete}
            >
              <Button
                variant="text"
                color="red"
                shape="circle"
                disabled={!location.abilities.delete}
              >
                <HugeiconsIcon icon={Delete02Icon} size={20} />
              </Button>
            </Popconfirm>
          </Tooltip>,
          <Tooltip title="More" placement="bottom" mouseEnterDelay={0.5} >
            <Dropdown
              trigger={['click']}
              popupRender={() => (
                <Menu>
                  <Menu.Item key="artworks"
                    onClick={() => router.visit(route('artworks.index', { location: location.id }))}
                  >
                    <FlexBox>
                      <HugeiconsIcon icon={Image02Icon} size={20} />
                      <div>View Artworks</div>
                    </FlexBox>
                  </Menu.Item>
                  <Menu.Item key="set-primary"
                    onClick={handleSetAsPrimary}
                    disabled={location.is_primary || !location.is_active || !location.abilities.update}
                  >
                    <FlexBox>
                      <HugeiconsIcon icon={StarIcon} size={20} />
                      <div>Set as Primary</div>
                    </FlexBox>
                  </Menu.Item>
                  <Menu.Item key="activate"
                    onClick={handleToggleActive}
                    disabled={!location.abilities.update}
                  >
                    {location.is_active ? (
                      <FlexBox>
                        <HugeiconsIcon icon={ViewOffSlashIcon} size={20} />
                        <div>Deactivate</div>
                      </FlexBox>
                    ) : (
                      <FlexBox>
                        <HugeiconsIcon icon={ViewIcon} size={20} />
                        <div>Activate</div>
                      </FlexBox>
                    )}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="labels-report"
                    onClick={() => setShowCreateLabelsReportModal(true)}
                    disabled={!user.has_edit_access}
                  >
                    <FlexBox>
                      <HugeiconsIcon icon={NoteIcon} size={20} />
                      <div>Create Labels Report</div>
                    </FlexBox>
                  </Menu.Item>
                  <Menu.Item key="inventory-report"
                    onClick={() => setShowCreateInventoryReportModal(true)}
                    disabled={!user.has_edit_access}
                  >
                    <FlexBox>
                      <HugeiconsIcon icon={LayoutTable02Icon} size={20} />
                      <div>Create Inventory Report</div>
                    </FlexBox>
                  </Menu.Item>
                </Menu>
              )}
            >
              <Button
                variant="text"
                color="purple"
                shape="circle"
              >
                <HugeiconsIcon icon={MoreHorizontalSquare01Icon} size={20} />
              </Button>
            </Dropdown>
          </Tooltip>,
        ]}
      >
        <FlexBox direction="col" alignItems="start" className="min-h-[200px]" >
          {location.description && (
            <TextboxExpandable
              content={location.description ?? ''}
              lines={2}
              className="mb-5"
            />
          )}
          <DataRow
            icon={<HugeiconsIcon icon={Location01Icon} size={24} />}
            value={location.formatted_address}
            wrapping={false}
            align="start"
            showCopyToClipboard
          />
          <GoogleMap
            coordinates={location.address?.coordinates}
            height={250}
            hideIfNotFound
            className="mt-1"
          />
          <Divider />
          <FlexBox gap={3} alignItems="end" >
            <FlexBox
              direction="col"
              alignItems="start"
              className="!w-max cursor-pointer hover:text-link"
              onClick={() => router.visit(route('artworks.index', { location: location.id }))}
            >
              <div className="text-5xl font-light">{location.artworks_count}</div>
              <div>Artworks</div>
            </FlexBox>
            <ImageGroup
              images={location.artworks_images_urls ?? []}
              // className="grow"
            />
          </FlexBox>
        </FlexBox>

        {!location.is_active && (
          <div
            className="absolute top-[20px] -right-[44px] rotate-45 border border-solid border-gray-500/50
            bg-light text-muted text-center px-10 uppercase tracking-widest"
          >
            Inactive
          </div>
        )}
      </Card>

      <LocationCreateEditModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        mode="edit"
        location={location}
      />

      {showCreateLabelsReportModal && (
        <CreateLabelsReportsDrawer
          show={showCreateLabelsReportModal}
          onClose={() => setShowCreateLabelsReportModal(false)}
          preSelectedArtworkIds={location.artworks_ids ?? []}
        />
      )}

      {showCreateInventoryReportModal && (
        <CreateInventoryReportDrawer
          show={showCreateInventoryReportModal}
          onClose={() => setShowCreateInventoryReportModal(false)}
          preSelectedArtworkIds={location.artworks_ids ?? []}
        />
      )}

      {notificationContextHolder}
    </>
  );
}

export default LocationCard;
