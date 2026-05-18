import colors from "@/Themes/theme";
import { HelpCircleIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import React from "react";

type Props = {
  title?: string;
  content: string | React.ReactNode;
  iconType?: 'info' | 'question';
  placement?: TooltipPlacement;
  condition?: boolean;
}

function InfoPopover({ title, content, iconType = 'info', placement, condition = true }: Props) {

  if (!condition) return null;

  const icon = {
    info: InformationCircleIcon,
    question: HelpCircleIcon,
  }

  return (
    <Popover
      title={title}
      content={content}
      placement={placement || undefined}
    >
      <HugeiconsIcon icon={icon[iconType]} size={16} color={colors.gray[500]} />
    </Popover>
  )
}

export default InfoPopover;
