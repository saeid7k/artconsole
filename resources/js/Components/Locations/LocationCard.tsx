import { LocationProps } from "@/types/location";
import { Delete02Icon, Location01Icon, MoreHorizontalSquare01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Card, Divider, Tag, Tooltip } from "antd";
import { useState } from "react";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import ImageGroup from "../ImageGroup";
import TextboxExpandable from "../TextboxExpandable";
import LocationCreateEditModal from "./LocationCreateEditModal";

function LocationCard({ location }: { location: LocationProps }) {

  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <>
      <Card
        title={
          <FlexBox justifyContent="between" gap={3}>
            <div>{location.name}</div>
            {location.is_primary && (
              <Tag color="blue">Primary</Tag>
            )}
          </FlexBox>
        }
        className="w-full"
        actions={[
          <Tooltip title="Edit Location" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="default"
              shape="circle"
              onClick={() => setOpenEditModal(true)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
            </Button>
          </Tooltip>,
          <Tooltip title="Delete Location" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="red"
              shape="circle"
            >
              <HugeiconsIcon icon={Delete02Icon} size={20} />
            </Button>
          </Tooltip>,
          <Tooltip title="More" placement="bottom" mouseEnterDelay={0.5} >
            <Button
              variant="text"
              color="purple"
              shape="circle"
            >
              <HugeiconsIcon icon={MoreHorizontalSquare01Icon} size={20} />
            </Button>
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
    </>
  );
}

export default LocationCard;
