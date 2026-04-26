import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import { Tag } from "antd";
import { twMerge } from "tailwind-merge";

type Props = {
  status: string;
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function ArtworkStatusTag({ status, variant = "filled", fontSize = "sm", className }: Props) {

  const selectedStatus = ARTWORK_STATUSES.find((s) => s.value === status);

  return (
    <Tag
      color={selectedStatus?.color || 'default'}
      variant={variant}
      className={twMerge(
        'font-semibold',
        `text-${fontSize}`,
        className
      )}
    >
      {selectedStatus?.label || status}
    </Tag>
  );
}

export default ArtworkStatusTag;
