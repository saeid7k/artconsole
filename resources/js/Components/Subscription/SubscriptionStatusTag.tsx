import { Tag } from "antd";

type Props = {
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function SubscriptionStatusTag({ status, variant = "filled", fontSize = "sm", className }: Props) {

  const colorMap = {
    'incomplete': 'orange',
    'incomplete_expired': 'red',
    'trialing': 'blue',
    'active': 'green',
    'past_due': 'volcano',
    'canceled': 'default',
    'unpaid': 'magenta',
    'paused': 'gray',
  }

  return (
    <Tag
      color={colorMap[status] ?? 'default'}
      variant={variant}
      className={`text-${fontSize} font-semibold ${className || ''}`}
    >
      {status}
    </Tag>
  );
}

export default SubscriptionStatusTag;
