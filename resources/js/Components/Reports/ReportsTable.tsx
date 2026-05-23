import { useWindow } from "@/hooks/useWindow";
import { paginate } from "@/utils/paginationHelper";
import { keyToTitle } from "@/utils/stringHelper";
import { LabelIcon, LayoutTable02Icon, NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Table, TableProps, Tag } from "antd";
import FlexBox from "../Containers/FlexBox";
import NewTag from "../NewTag";
import StyledDate from "../StyledDate";
import TextboxExpandable from "../TextboxExpandable";
import ReportsTableActions from "./ReportsTableActions";
import colors from "@/Themes/theme";

function ReportsTable({ reports }: any) {

  const { breakpoint, windowWidth } = useWindow()

  const reportTypeIcon: { [key: string]: React.ReactNode } = {
    'wall_label': <HugeiconsIcon icon={LabelIcon} size={20} color={colors.blue[600]} />,
    'inventory': <HugeiconsIcon icon={LayoutTable02Icon} size={20} color={colors.purple[600]} />,
  }

  // Table columns

  const columns: TableProps['columns'] = [
    {
      key: 'type',
      title: 'Type',
      render: (record: any) => (
        <FlexBox >
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
          <FlexBox gap={2}>
            <div>{record.name}</div>
            <NewTag dateRef={record.created_at} />
          </FlexBox>
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
      render: (text: string) => <StyledDate value={text} />
    },
    {
      title: 'Options',
      key: 'options',
      render: (record: any) => (
        <FlexBox direction="col" alignItems="start" gap={1} justifyContent="between" className="max-w-[150px]" >
          <FlexBox justifyContent="between">
            Artworks:
            <Tag variant="outlined" >{record.artworks?.length ?? 0}</Tag>
          </FlexBox>
          {record?.options?.size && (
            <FlexBox justifyContent="between">
              Size:
              <Tag variant="outlined" >{keyToTitle(record.options.size)}</Tag>
            </FlexBox>
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
        x: 'max-content',
        y: windowWidth < 1024 ? '70vh' : '70vh'
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
