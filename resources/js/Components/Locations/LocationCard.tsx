import { LocationProps } from "@/types/location";
import { Delete02Icon, Location01Icon, MoreHorizontalSquare01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Tag } from "antd";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import ImageGroup from "../ImageGroup";
import TextboxExpandable from "../TextboxExpandable";

function LocationCard({ location }: { location: LocationProps }) {
  return (
    <Card
      title={
        <FlexBox justifyContent="between" gap={3}><div>{location.name}</div><Tag color="blue">Primary</Tag></FlexBox>
      }
      className="w-full"
      actions={[
        <Button
          variant="text"
          color="blue"
          shape="circle"
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
        </Button>,
        <Button
          variant="text"
          color="red"
          shape="circle"
        >
          <HugeiconsIcon icon={Delete02Icon} size={20} />
        </Button>,
        <Button
          variant="text"
          color="default"
          shape="circle"
        >
          <HugeiconsIcon icon={MoreHorizontalSquare01Icon} size={20} />
        </Button>,
      ]}
    >
      <FlexBox gap={6} direction="col" alignItems="start">
        {location.description && (
          <TextboxExpandable
            content={location.description ?? ''}
            lines={2}
          />
        )}
        <DataRow
          icon={<HugeiconsIcon icon={Location01Icon} size={24} />}
          label=""
          value={location.formatted_address}
          wrapping={false}
          align="start"
          showCopyToClipboard
        />
        <FlexBox gap={3} >
          <FlexBox direction="col" alignItems="start" className="!w-max" >
            <div className="text-5xl font-light">{location.artworks_count}</div>
            <div>Artworks</div>
          </FlexBox>
          <ImageGroup
            images={location.artworks_images_urls ?? []}
            className="grow"
          />
        </FlexBox>
      </FlexBox>
    </Card>
  );
}

export default LocationCard;
