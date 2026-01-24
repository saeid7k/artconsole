import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { message, Tooltip } from "antd";

type Props = {
  content: string | number | null;
  title?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function CopyToClipboard({ content, title = null, size = 'md', className = '' }: Props) {

  function copyText(text: any) {
    let titleToUse = title || 'Text';
    navigator.clipboard.writeText(text).then(() => {
      message.success(titleToUse + ' copied to clipboard');
    }).catch((err) => {
      message.error('Failed to copy ' + titleToUse + ': ' + err);
    });
  }

  const iconSizeMap = {
    'xs': 12,
    'sm': 14,
    'md': 16,
    'lg': 20,
    'xl': 24,
  }

  return (
    <Tooltip title={`Copy to Clipboard`} mouseEnterDelay={0.5} placement="right" >
      <HugeiconsIcon
        icon={Copy01Icon}
        size={iconSizeMap[size]}
        className={`cursor-pointer text-muted hover:text-primary ${className}`}
        onClick={() => copyText(content)}
      />
    </Tooltip>
  )
}

export default CopyToClipboard;
