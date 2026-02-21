import useReport from "@/hooks/useReport"
import { Delete02Icon, FileViewIcon, PdfIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Tooltip } from "antd"
import { useState } from "react"
import FlexBox from "../Containers/FlexBox"
import ReportPreviewDrawer from "./ReportPreviewDrawer"

function ReportsTableActions({ report }: any) {

  const [showPreview, setShowPreview] = useState(false)
  const { handleDownload } = useReport(report);

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
          <Button
            variant="text"
            color='danger'
            shape="circle"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
          />
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
