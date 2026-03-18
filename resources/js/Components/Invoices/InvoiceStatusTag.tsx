import INVOICE_STATUSES from "@/constants/invoiceStatuses";
import { Tag } from "antd";

type Props = {
  status: string;
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function InvoiceStatusTag({ status, variant = "filled", fontSize = "sm", className }: Props) {

  const selectedStatus = INVOICE_STATUSES.find((s) => s.value === status);

  return (
    <Tag
      color={selectedStatus?.color || 'default'}
      variant={variant}
      className={`text-${fontSize} font-semibold ${className || ''}`}
    >
      {selectedStatus?.label || status}
    </Tag>
  );
}

export default InvoiceStatusTag;
