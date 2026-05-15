import { Popover } from "antd";

type Props = {
  title?: string;
  content: string | React.ReactNode;
  children: string | React.ReactNode;
}

function InlinePopover({ title, content, children }: Props) {
  return (
    <Popover
      title={title}
      content={content}
    >
      <span className="border-b border-dashed border-muted mx-1 cursor-help">
        {children}
      </span>
    </Popover>
  )
}

export default InlinePopover;
