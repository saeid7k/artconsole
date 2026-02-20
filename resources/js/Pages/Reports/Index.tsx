import FlexBox from "@/Components/Containers/FlexBox"
import PageTitle from "@/Components/PageTitle"
import CreateArtworksReportsDrawer from "@/Components/Reports/CreateArtworksReportsDrawer"
import ReportsTableActions from "@/Components/Reports/ReportsTableActions"
import TextboxExpandable from "@/Components/TextboxExpandable"
import { useWindow } from "@/hooks/useWindow"
import AppLayout from "@/Layouts/AppLayout"
import { formatByKey } from "@/utils/formatHelper"
import { keyToTitle } from "@/utils/stringHelper"
import { AddIcon, AddSquareIcon, CircleArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Card, Dropdown, Empty, Menu, Table, TableProps, Tooltip } from "antd"
import dayjs from "dayjs"
import { useState } from "react"

function Index({ reports = [] }: any) {

  const { breakpoint } = useWindow()

  const [showCreateArtworksReportsDrawer, setShowCreateArtworksReportsDrawer] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<any>('artworks_label')

  // Table columns

  const columns: TableProps['columns'] = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => keyToTitle(text)
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: any) => (
        <FlexBox direction="col" alignItems="start" gap={0} className="max-w-[300px]" >
          <div>{record.name}</div>
          <TextboxExpandable
            content={record.description}
            lines={1}
            className="text-ghost"
          />
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

  // New Report

  const handleNewReportClick = (type: any) => {
    setSelectedReportType(type)
    setShowCreateArtworksReportsDrawer(true)
  }

  function NewReportDropdown({children}: {children: React.ReactNode}) {
    return (
      <Dropdown
        trigger={["click"]}
        popupRender={() =>
          <Menu
            items={[
              { key: 'artworks_label', label: 'Artworks Label', onClick: () => handleNewReportClick('artworks_label') },
              { key: 'inventory_report', label: 'Inventory Report', onClick: () => handleNewReportClick('inventory_report') },
            ]}
          />
        }
      >
        {children}
      </Dropdown>
    )
  }

  return (
    <div>
      <PageTitle
        title="Reports"
        counter={reports?.length || 0}
        extraTitleContent={
          <NewReportDropdown>
            <Tooltip title="Create New Report" >
              <Button
                type="text"
                shape="circle"
                icon={<HugeiconsIcon icon={AddSquareIcon} size={20} />}
              >
              </Button>
            </Tooltip>
          </NewReportDropdown>
        }
      />

      {reports?.length == 0 && (
        <FlexBox direction="col" gap={5} >
          <Empty description="No reports available" />
          <NewReportDropdown>
            <Button
              icon={<HugeiconsIcon icon={AddIcon} />}
              size="large"
            >
              Create a new report
            </Button>
          </NewReportDropdown>
        </FlexBox>
      )}
      {reports?.length > 0 && (
        <Table
          dataSource={reports}
          columns={columns}
          scroll={{
            x: 'max-content'
          }}
        />
      )}

      <CreateArtworksReportsDrawer
        type={selectedReportType}
        show={showCreateArtworksReportsDrawer}
        onClose={() => setShowCreateArtworksReportsDrawer(false)}
      />
    </div>
  )
}

Index.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Index
