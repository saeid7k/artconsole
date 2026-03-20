import { useWindow } from "@/hooks/useWindow";
import { ContactProps } from "@/types/contact";
import { UsePageProps } from "@/types/usePage";
import { paginate } from "@/utils/paginationHelper";
import { usePage } from "@inertiajs/react";
import { Table, TableProps } from "antd";
import StyledCurrency from "../StyledCurrency";
import StyledDate from "../StyledDate";
import InvoiceStatusTag from "./InvoiceStatusTag";
import InvoicesActions from "./InvoicesActions";

function InvoiceTable({ invoices }: any) {

  const gallery = usePage<UsePageProps>()?.props?.current_gallery
  const { breakpoint } = useWindow()

  // Table columns

  const columns: TableProps['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text: string) => <StyledDate value={text} showTime={false} />
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text: string) => <div>{gallery?.meta?.invoice_prefix}{text}</div>
    },
    {
      title: 'Customer',
      dataIndex: 'contact',
      key: 'contact',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (record: ContactProps) => <div>{record.full_name}</div>
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text: string) => <StyledCurrency value={text} />,
      align: "right"
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <InvoiceStatusTag status={text} />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => <InvoicesActions invoice={record} />,
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
    }
  ]

  return (
    <Table
      dataSource={invoices.data}
      columns={columns}
      scroll={{
        x: 'max-content'
      }}
      pagination={{
        current: invoices.current_page,
        total: invoices.total,
        pageSize: invoices.per_page,
        showSizeChanger: true,
      }}
      onChange={(pagination, filters, sorter: any) => {
        paginate({
          routeName: 'invoices.index',
          pagination,
          sorter,
        })
      }}
    />
  )
}

export default InvoiceTable;
