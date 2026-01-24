import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag, Tooltip } from "antd";
import FlexBox from "../Containers/FlexBox";
import CopyToClipboard from "../CopyToClipboard";

function MediaNameStack({ media }: { media: any }) {
  return (
    <FlexBox gap={2} >
      <div>{media.file_name}</div>
      <Tooltip title='Rename' mouseEnterDelay={0.5} >
        <HugeiconsIcon
          icon={Edit02Icon}
          size={16}
          className="cursor-pointer text-muted hover:text-primary"
        />
      </Tooltip>
      <CopyToClipboard content={media.file_name} title="File Name" />
      {media.is_main && (
        <Tag variant="solid" color="blue" className="ml-2">Main</Tag>
      )}
    </FlexBox>
  )
}

export default MediaNameStack;
