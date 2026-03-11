import FlexBox from "@/Components/Containers/FlexBox"
import PageTitle from "@/Components/PageTitle"
import CreateInventoryReportDrawer from "@/Components/Reports/CreateInventoryReportDrawer"
import CreateLabelsReportsDrawer from "@/Components/Reports/CreateLabelsReportsDrawer"
import ReportsTable from "@/Components/Reports/ReportsTable"
import AppLayout from "@/Layouts/AppLayout"
import { AddIcon, AddSquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePage } from "@inertiajs/react"
import { Button, Dropdown, Empty, Menu, Tooltip } from "antd"
import { useState } from "react"

function Index({ reports }: any) {

  const user = usePage().props.auth.user

  const [showCreateLabelsReportsDrawer, setShowCreateLabelsReportsDrawer] = useState(false)
  const [showCreateInventoryReportDrawer, setShowCreateInventoryReportDrawer] = useState(false)

  // New Report

  const handleNewReportClick = (type: any) => {
    if (type === 'artworks_label') {
      setShowCreateLabelsReportsDrawer(true)
    } else if (type === 'inventory') {
      setShowCreateInventoryReportDrawer(true)
    }
  }

  function NewReportDropdown({children}: {children: React.ReactNode}) {
    return (
      <Dropdown
        trigger={["click"]}
        popupRender={() =>
          <Menu
            items={[
              { key: 'artworks_label', label: 'Artworks Label', onClick: () => handleNewReportClick('artworks_label') },
              { key: 'inventory', label: 'Inventory Report', onClick: () => handleNewReportClick('inventory') },
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
                disabled={!user.has_edit_access}
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

      <CreateLabelsReportsDrawer
        show={showCreateLabelsReportsDrawer}
        onClose={() => setShowCreateLabelsReportsDrawer(false)}
      />
      <CreateInventoryReportDrawer
        show={showCreateInventoryReportDrawer}
        onClose={() => setShowCreateInventoryReportDrawer(false)}
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
