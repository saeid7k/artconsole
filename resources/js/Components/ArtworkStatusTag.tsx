import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import { Tag } from "antd";

function ArtworkStatusTag({ status }: { status: string }) {

  const selectedStatus = ARTWORK_STATUSES.find((s) => s.value === status);

  return (
    <Tag
      color={selectedStatus?.color || 'default'}
    >
      {selectedStatus?.label || status}
    </Tag>
  );
}

export default ArtworkStatusTag;
