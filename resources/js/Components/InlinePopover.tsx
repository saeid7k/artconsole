import { Popover } from "antd";

type Props = {
  title?: string;
  content: string | React.ReactNode;
  placement?: "top" | "left" | "right" | "bottom";
  trigger?: "click" | "hover" | "focus";
  children: string | React.ReactNode;
}

function InlinePopover({ title, content, placement = 'bottom', trigger = 'click', children }: Props) {
  return (
    <Popover
      title={title}
      content={content}
      placement={placement}
      trigger={[trigger]}
    >
      <span className="border-b border-dashed border-muted mx-1 cursor-help">
        {children}
      </span>
    </Popover>
  )
}

export default InlinePopover;
