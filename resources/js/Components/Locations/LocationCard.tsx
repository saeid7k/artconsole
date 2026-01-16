import { LocationProps } from "@/types/location";
import { Delete02Icon, Location01Icon, MoreHorizontalSquare01Icon, PencilEdit02Icon, StarCircleIcon, StarIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Card, Divider, Dropdown, Menu, message, notification, Popconfirm, Tag, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import ImageGroup from "../ImageGroup";
import TextboxExpandable from "../TextboxExpandable";
import LocationCreateEditModal from "./LocationCreateEditModal";

function LocationCard({ location }: { location: LocationProps }) {

  const [openEditModal, setOpenEditModal] = useState(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification();

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
        title: 'Cannot Delete Location',
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

  return (
    <>
      <Card
        title={
          <FlexBox justifyContent="between" gap={3} >
            <div>{location.name}</div>
            {location.is_primary && (
              <Tag color="blue">Primary</Tag>
            )}
            {!location.is_primary && (
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
          "w-full group",
          location.is_primary ? 'border-blue-500/50' : ''
        )}
        actions={[
          <Tooltip title="Edit" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="default"
              shape="circle"
              onClick={() => setOpenEditModal(true)}
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
                  <Menu.Item key="set-primary"
                    onClick={handleSetAsPrimary}
                    disabled={location.is_primary}
                  >
                    <FlexBox>
                      <HugeiconsIcon icon={StarIcon} size={20} />
                      <div>Set as Primary</div>
                    </FlexBox>
                  </Menu.Item>
                  <Menu.Item key="activate"
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
        <FlexBox direction="col" alignItems="start">
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
          <Divider />
          <FlexBox direction="col" gap={0} alignItems="center" >
            <FlexBox gap={3} alignItems="end" >
              <FlexBox direction="col" alignItems="start" className="!w-max" >
                <div className="text-5xl font-light">{location.artworks_count}</div>
                <div>Artworks</div>
              </FlexBox>
              <ImageGroup
                images={location.artworks_images_urls ?? []}
                // className="grow"
              />
            </FlexBox>
            {location.artworks_count > 0 && (
              <Button
                size="small"
                type="link"
                onClick={() => router.visit(route('artworks.index', { location: location.id }))}
              >
                View Artworks
              </Button>
            )}
          </FlexBox>
        </FlexBox>
      </Card>

      <LocationCreateEditModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        mode="edit"
        location={location}
      />

      {notificationContextHolder}
    </>
  );
}

export default LocationCard;
