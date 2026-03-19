import INVOICE_STATUSES from "@/constants/invoiceStatuses";
import { Tag } from "antd";
import FlexBox from "../Containers/FlexBox";

type Props = {
  status: string;
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function InvoiceStatusTag({ status, variant = "filled", fontSize = "sm", className }: Props) {

  const selectedStatus = INVOICE_STATUSES.find((s) => s.value === status);

  const iconBgClass = () => {
    switch (selectedStatus?.color) {
      case 'black':
        return 'bg-gray-900';
      default:
        return `bg-${selectedStatus?.color || 'gray'}-500`;
    }
  }

  return (
    <Tag
      color={selectedStatus?.color || 'default'}
      variant={variant}
      className={`text-${fontSize} font-semibold ${className || ''}`}
    >
      <FlexBox>
        <span className={`w-2 h-2 rounded-full ${iconBgClass()}`}></span>
        {selectedStatus?.label || status}
      </FlexBox>
    </Tag>
  );
}

export default InvoiceStatusTag;
