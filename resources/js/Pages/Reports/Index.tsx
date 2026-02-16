import FlexBox from "@/Components/Containers/FlexBox"
import PageTitle from "@/Components/PageTitle"
import CreateArtworksReportsDrawer from "@/Components/Reports/CreateArtworksReportsDrawer"
import AppLayout from "@/Layouts/AppLayout"
import { AddIcon, AddSquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Dropdown, Empty, Menu, Table, Tooltip } from "antd"
import { useState } from "react"

function Index({ reports = [] }: any) {

  const [showCreateArtworksReportsDrawer, setShowCreateArtworksReportsDrawer] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<'artworks-label' | 'inventory-report'>('artworks-label')

  const handleNewReportClick = (type: 'artworks-label' | 'inventory-report') => {
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
              { key: 'artworks-label', label: 'Artworks Label', onClick: () => handleNewReportClick('artworks-label') },
              { key: 'inventory-report', label: 'Inventory Report', onClick: () => handleNewReportClick('inventory-report') },
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
