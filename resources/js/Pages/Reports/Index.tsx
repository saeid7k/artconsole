import FlexBox from "@/Components/Containers/FlexBox"
import PageTitle from "@/Components/PageTitle"
import CreateArtworksReportsDrawer from "@/Components/Reports/CreateArtworksReportsDrawer"
import ReportsTable from "@/Components/Reports/ReportsTable"
import AppLayout from "@/Layouts/AppLayout"
import { AddIcon, AddSquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Dropdown, Empty, Menu, Tooltip } from "antd"
import { useState } from "react"

function Index({ reports }: any) {

  const [showCreateArtworksReportsDrawer, setShowCreateArtworksReportsDrawer] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<any>('artworks_label')

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
        counter={reports?.data?.length || 0}
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

      {reports?.data?.length == 0 && (
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
      {reports?.data?.length > 0 && (
        <ReportsTable reports={reports} />
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
