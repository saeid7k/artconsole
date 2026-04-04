import { PENDING_INVOICE_STATUSES } from "@/constants/invoiceStatuses";
import { useWindow } from "@/hooks/useWindow";
import { PageProps } from "@/types";
import { ContactProps } from "@/types/contact";
import { paginate } from "@/utils/paginationHelper";
import { ContactIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Table, TableProps, Tooltip } from "antd";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";
import StyledCurrency from "../StyledCurrency";
import StyledDate from "../StyledDate";
import InvoiceFormDrawer from "./InvoiceFormDrawer";
import InvoiceNumberStack from "./InvoiceNumberStack";
import InvoiceStatusTag from "./InvoiceStatusTag";
import InvoicesActions from "./InvoicesActions";

type Props = {
  invoices: PageProps;
};

function InvoiceTable({ invoices }: Props) {

  const { breakpoint } = useWindow()

  const [showInvoiceFormDrawer, setShowInvoiceFormDrawer] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<number | null>(null)

  function handleEditInvoice(invoiceId: number) {
    setEditingInvoice(invoiceId)
    setShowInvoiceFormDrawer(true)
  }

  function handleCloseInvoiceFormDrawer() {
    setEditingInvoice(null)
    setShowInvoiceFormDrawer(false)
  }

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
      render: (text: string, record: any) => <InvoiceNumberStack invoice={record} />
    },
    {
      title: 'Customer',
      dataIndex: 'contact',
      key: 'contact',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (record: ContactProps) => (
        <FlexBox>
          <HugeiconsIcon icon={ContactIcon} size={20} className="text-muted" />
          <Tooltip title='View Contact Card' mouseEnterDelay={0.5} >
            <Link
              href={route('contacts.show', record.id)}
              className="body-link"
            >
              {record?.full_name}
            </Link>
          </Tooltip>
        </FlexBox>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text: string) => <StyledCurrency value={text} className="font-bold" />,
      align: "right",
      width: 150,
    },
    {
      title: 'Amount Due',
      dataIndex: 'amount_due',
      key: 'amount_due',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text: string) => Number(text) == 0 ? '-' : <StyledCurrency value={text} />,
      align: "right",
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <InvoiceStatusTag invoice={record} />
          {PENDING_INVOICE_STATUSES.includes(record.status) && (
            <div
              className={twMerge(
                "text-xs",
                record.due_remaining_days < 0 ? "text-red-500" : "text-muted"
              )}
            >
              {record.due_remaining_days === 0 && 'Due today'}
              {record.due_remaining_days !== 0 && (
                <>
                  {Math.abs(record.due_remaining_days)} days {record.due_remaining_days < 0 ? 'overdue' : 'to due'}
                </>
              )}
            </div>
          )}
        </div>
      ),
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => <InvoicesActions invoice={record} />,
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 150,
    }
  ]

  return (
    <>
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
        rowClassName='group'
      />

      {/* Components */}

      <InvoiceFormDrawer
        show={showInvoiceFormDrawer}
        onClose={() => handleCloseInvoiceFormDrawer()}
        invoiceId={editingInvoice}
      />
    </>
  )
}

export default InvoiceTable;
