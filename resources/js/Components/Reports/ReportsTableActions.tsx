import useReport from "@/hooks/useReport"
import { Delete02Icon, FileViewIcon, PdfIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Popconfirm, Tooltip } from "antd"
import { useState } from "react"
import FlexBox from "../Containers/FlexBox"
import ReportPreviewDrawer from "./ReportPreviewDrawer"

function ReportsTableActions({ report }: any) {

  const [showPreview, setShowPreview] = useState(false)
  const { handleDownload, deleteMutation } = useReport(report);

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
            />
          </Popconfirm>
        </Tooltip>
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
