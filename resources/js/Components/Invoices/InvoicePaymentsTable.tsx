import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { PaymentProps } from "@/types/payment";
import { keyToTitle } from "@/utils/stringHelper";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Table, TableProps, Tooltip } from "antd";
import dayjs from "dayjs";
import FlexBox from "../Containers/FlexBox";
import StyledCurrency from "../StyledCurrency";

type Props = {
  payments: PaymentProps[];
};

function InvoicePaymentsTable({ payments }: Props) {
  const columns: TableProps<PaymentProps>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'date',
      sorter: (a: PaymentProps, b: PaymentProps) => new Date(a.payment_date || 0).getTime() - new Date(b.payment_date || 0).getTime(),
      showSorterTooltip: false,
      render: (payment_date: string) => dayjs(payment_date).format('LL'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: PaymentProps, b: PaymentProps) => a.amount - b.amount,
      showSorterTooltip: false,
      render: (amount: number) => <StyledCurrency value={amount} />,
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'method',
      sorter: (a: PaymentProps, b: PaymentProps) => (a.payment_method || '').localeCompare(b.payment_method || ''),
      showSorterTooltip: false,
      filters: PAYMENT_METHODS.map(method => ({ text: keyToTitle(method.label), value: method.value })),
      onFilter: (value, record) => record.payment_method === value,
      render: (method: string) => keyToTitle(method),
    },
    {
      title: '',
      key: 'actions',
      render: () => <FlexBox>
        <Tooltip title="Delete Payment" mouseEnterDelay={0.5} placement="topRight">
          <Button variant="text" color="danger" size="small" shape="circle" icon={<HugeiconsIcon icon={Delete02Icon} size={16} />} />
        </Tooltip>
      </FlexBox>
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={payments}
      rowKey="id"
      pagination={false}
      size="small"
      className="[&_th]:!bg-[#fff0]"
      scroll={{
        x: 'max-content',
        y: 200,
      }}
    />
  );
}

export default InvoicePaymentsTable;
