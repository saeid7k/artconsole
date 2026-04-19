import { Tag } from "antd";
import { twMerge } from "tailwind-merge";

type Props = {
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function SubscriptionInvoiceStatusTag({ status, variant = "filled", fontSize = "sm", className }: Props) {

  const colorMap = {
    'draft': 'orange',
    'open': 'blue',
    'paid': 'green',
    'uncollectible': 'volcano',
    'void': 'default',
  }

  return (
    <Tag
      color={colorMap[status] ?? 'default'}
      variant={variant}
      className={twMerge(
        'font-semibold w-max h-max',
        `text-${fontSize}`,
        className,
      )}
    >
      {status}
    </Tag>
  );
}

export default SubscriptionInvoiceStatusTag;
