import { PaymentProps } from "@/types/payment";
import { keyToTitle } from "@/utils/stringHelper";
import { Table, TableProps } from "antd";
import dayjs from "dayjs";
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
      render: (method: string) => keyToTitle(method),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={payments}
      rowKey="id"
      pagination={false}
      size="small"
      className="[&_th]:!bg-[#fff0]"
    />
  );
}

export default InvoicePaymentsTable;
