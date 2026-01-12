import { LocationProps } from "@/types/location";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, Tag } from "antd";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import ImageGroup from "../ImageGroup";
import TextboxExpandable from "../TextboxExpandable";

function LocationCard({ location }: { location: LocationProps }) {
  return (
    <Card
      title={
        <FlexBox gap={3}><div>{location.name}</div><Tag color="blue">Primary</Tag></FlexBox>
      }
      className="w-full"
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
