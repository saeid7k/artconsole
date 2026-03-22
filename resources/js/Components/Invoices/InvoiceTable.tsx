import { useWindow } from "@/hooks/useWindow";
import { ContactProps } from "@/types/contact";
import { UsePageProps } from "@/types/usePage";
import { paginate } from "@/utils/paginationHelper";
import { usePage } from "@inertiajs/react";
import { Button, Table, TableProps } from "antd";
import { useState } from "react";
import StyledCurrency from "../StyledCurrency";
import StyledDate from "../StyledDate";
import InvoiceFormDrawer from "./InvoiceFormDrawer";
import InvoiceStatusTag from "./InvoiceStatusTag";
import InvoicesActions from "./InvoicesActions";

function InvoiceTable({ invoices }: any) {

  const gallery = usePage<UsePageProps>()?.props?.current_gallery
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
      render: (text: string, record: any) => (
        <Button
          type="text"
          size="small"
          onClick={() => handleEditInvoice(record.id)}
        >
          <code>{record.invoice_number}</code>
        </Button>
      )
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
      render: (text: string, record: any) => <InvoiceStatusTag invoice={record} />,
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => <InvoicesActions invoice={record} />,
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
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
