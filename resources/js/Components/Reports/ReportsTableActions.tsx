import { downloadFile } from "@/utils/downloadHelper"
import { Delete02Icon, FileViewIcon, PdfIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Tooltip } from "antd"
import FlexBox from "../Containers/FlexBox"

function ReportsTableActions({ report }: any) {

  function handleDownload() {
    downloadFile({
      url: route('reports.download', { report: report.id }),
      fileName: report.name + '.pdf'
    })
  }

  return (
    <FlexBox>
      <Tooltip title="Preview">
        <Button
          variant="text"
          color='blue'
          shape="circle"
          icon={<HugeiconsIcon icon={FileViewIcon} size={20} />}
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
  )
}

export default ReportsTableActions
