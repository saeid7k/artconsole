import { useWindow } from "@/hooks/useWindow";
import { formatByKey } from "@/utils/formatHelper";
import { paginate } from "@/utils/paginationHelper";
import { keyToTitle } from "@/utils/stringHelper";
import { CircleArrowDown01Icon, NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Dropdown, Table, TableProps } from "antd";
import dayjs from "dayjs";
import FlexBox from "../Containers/FlexBox";
import TextboxExpandable from "../TextboxExpandable";
import ReportsTableActions from "./ReportsTableActions";

function ReportsTable({ reports }: any) {

  const { breakpoint } = useWindow()

  const reportTypeIcon: { [key: string]: React.ReactNode } = {
    'artworks_label': <HugeiconsIcon icon={NoteIcon} size={20} />,
    'inventory_report': <HugeiconsIcon icon={CircleArrowDown01Icon} size={20} />,
  }

  // Table columns

  const columns: TableProps['columns'] = [
    {
      title: 'Type',
      key: 'type',
      render: (record: any) => (
        <FlexBox>
          {reportTypeIcon[record.type]}
          {keyToTitle(record.type)}
        </FlexBox>
      )
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: any) => (
        <FlexBox direction="col" alignItems="start" gap={0} className="max-w-[300px]" >
          <div>{record.name}</div>
          {record.description && (
            <TextboxExpandable
              content={record.description}
              lines={1}
              className="text-ghost"
            />
          )}
        </FlexBox>
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => dayjs(text).format('LLL')
    },
    {
      title: 'Info',
      key: 'info',
      render: (record: any) => (
        <FlexBox direction="col" alignItems="start" gap={0} >
          <div>Artworks: {record.artworks?.length ?? 0}</div>
          {record.options && (
            <Dropdown
              trigger={['click']}
              popupRender={() => (
                <Card size="small" >
                  {Object.entries(record.options || {}).map(([key, value]: [string, any]) => (
                    <div key={key}><span className="label">{keyToTitle(key)}:</span> {formatByKey(key, value)}</div>
                  ))}
                </Card>
              )}
            >
              <Button
                type="text"
                size="small"
                icon={<HugeiconsIcon icon={CircleArrowDown01Icon} size={16} />}
                iconPlacement="end"
                className="text-ghost -translate-x-2"
              >
                Options
              </Button>
            </Dropdown>
          )}
        </FlexBox>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => <ReportsTableActions report={record} />,
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
    }
  ]

  return (
    <Table
      dataSource={reports.data}
      columns={columns}
      scroll={{
        x: 'max-content'
      }}
      pagination={{
        current: reports.current_page,
        total: reports.total,
        pageSize: reports.per_page,
        showSizeChanger: true,
      }}
      onChange={(pagination, filters, sorter: any) => {
        paginate({
          routeName: 'reports.index',
          pagination,
        })
      }}
    />
  )
}

export default ReportsTable;
