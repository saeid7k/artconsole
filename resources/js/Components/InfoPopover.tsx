import colors from "@/Themes/theme";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover } from "antd";

type Props = {
  title?: string;
  content: string;
  condition?: boolean;
}

function InfoPopover({ title, content, condition = true }: Props) {

  if (!condition) return null;

  return (
    <Popover
      title={title}
      content={content}
    >
      <HugeiconsIcon icon={InformationCircleIcon} size={16} color={colors.gray[500]} />
    </Popover>
  )
}

export default InfoPopover;
