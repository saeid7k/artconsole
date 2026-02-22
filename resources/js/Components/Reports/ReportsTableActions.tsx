import useReport from "@/hooks/useReport"
import { ArrowReloadHorizontalIcon, Delete02Icon, FileViewIcon, InformationCircleIcon, MoreHorizontalCircle01Icon, PdfIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Dropdown, Menu, Popconfirm, Popover, Tooltip } from "antd"
import { useState } from "react"
import FlexBox from "../Containers/FlexBox"
import ReportPreviewDrawer from "./ReportPreviewDrawer"

function ReportsTableActions({ report }: any) {

  const [showPreview, setShowPreview] = useState(false)
  const { handleDownload, deleteMutation, regenerateMutation } = useReport(report);

  return (
    <>
      <FlexBox>
        <Tooltip title="Preview">
          <Button
            variant="text"
            color='blue'
            shape="circle"
            icon={<HugeiconsIcon icon={FileViewIcon} size={20} />}
            onClick={() => setShowPreview(true)}
          />
        </Tooltip>
        <Tooltip title="Download PDF">
          <Button
            variant="text"
            color='red'
            shape="circle"
            icon={<HugeiconsIcon icon={PdfIcon} size={20} />}
            onClick={handleDownload}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title="Delete the report"
            description={
              <div>
                Are you sure to delete this report?
                <div className="italic text-red-500">{report.name}</div>
              </div>
            }
            onConfirm={() => deleteMutation.mutate()}
            okText="Yes"
            cancelText="No"
            placement="left"
            okType="danger"
          >
            <Button
              variant="text"
              color='danger'
              shape="circle"
              icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
              loading={deleteMutation.isPending}
            />
          </Popconfirm>
        </Tooltip>
        <Dropdown
          trigger={['click']}
          popupRender={() =>
            <Menu
              items={[
                {
                  key: 'regenerate',
                  icon: <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={16} />,
                  label: 'Regenerate Report',
                  onClick: () => regenerateMutation.mutate(),
                  extra: (
                    <Popover
                      content="The report will be regenerated based on the latest artworks data."
                      title="Regenerate Report"
                      children={<HugeiconsIcon icon={InformationCircleIcon} size={16} />}
                    />
                  )
                },
              ]}
            />
          }
        >
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={20} />}
            loading={regenerateMutation.isPending}
          />
        </Dropdown>
      </FlexBox>

      <ReportPreviewDrawer
        report={report}
        show={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  )
}

export default ReportsTableActions
