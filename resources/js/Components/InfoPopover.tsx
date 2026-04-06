import colors from "@/Themes/theme";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import React from "react";

type Props = {
  title?: string;
  content: string | React.ReactNode;
  placement?: TooltipPlacement;
  condition?: boolean;
}

function InfoPopover({ title, content, placement, condition = true }: Props) {

  if (!condition) return null;

  return (
    <Popover
      title={title}
      content={content}
      placement={placement || undefined}
    >
      <HugeiconsIcon icon={InformationCircleIcon} size={16} color={colors.gray[500]} />
    </Popover>
  )
}

export default InfoPopover;
