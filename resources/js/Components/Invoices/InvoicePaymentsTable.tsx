import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { PaymentProps } from "@/types/payment";
import { keyToTitle } from "@/utils/stringHelper";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Empty, message, Table, TableProps, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import FlexBox from "../Containers/FlexBox";
import StyledCurrency from "../StyledCurrency";

type Props = {
  payments: PaymentProps[];
  onUpdate?: () => void;
};

function InvoicePaymentsTable({ payments, onUpdate }: Props) {

  const deleteMutation = useMutation({
    mutationKey: ['deletePayment'],
    mutationFn: (paymentId: number) => axios.delete(route('payments.destroy', paymentId)),
    onSuccess: (response) => {
      message.success(response.data?.message || 'Payment deleted successfully');
      if (onUpdate) onUpdate();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete payment');
    }
  });

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
      align: 'right',
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
      render: (record: PaymentProps) => <FlexBox>
        <Tooltip title="Delete Payment" mouseEnterDelay={0.5} placement="topRight">
          <Button
            variant="text"
            color="danger"
            size="small"
            shape="circle"
            icon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
            onClick={() => deleteMutation.mutate(record.id)}
          />
        </Tooltip>
      </FlexBox>
    }
  ];

  if (payments.length === 0) {
    return (
      <Empty description="No payments recorded yet" />
    );
  }

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
      summary={(pageData) => {
        let totalPaid = 0;
        pageData.forEach(({ amount }) => {
          totalPaid += Number(amount);
        });

        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <div className="font-bold">Total Paid</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="text-right">
                <StyledCurrency value={totalPaid} className="font-bold" />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
}

export default InvoicePaymentsTable;
