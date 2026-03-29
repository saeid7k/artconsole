import useReport from "@/hooks/useReport";
import { Pdf01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer } from "antd";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";

type Props = {
  report: any;
  show: boolean;
  onClose: () => void;
}

function ReportPreviewDrawer({ report, show, onClose }: Props) {

  const { handleDownload } = useReport(report);

  const urlQuery = useQuery({
    queryKey: ['report-file', report.id],
    queryFn: () => axios.get(route('reports.url', { report: report.id }))
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching report URL:', error);
        return null;
      }),
    enabled: show && !!report.id
  })

  return(
    <Drawer
      title={
        <FlexBox wrapping="wrap" >
          {report.name}
          <Divider orientation="vertical" />
          <div className="text-primary">Preview</div>
        </FlexBox>
      }
      placement="right"
      onClose={onClose}
      open={show}
      resizable
      defaultSize={800}
      extra={
        <Button
          type="primary"
          onClick={handleDownload}
          icon={<HugeiconsIcon icon={Pdf01Icon} size={20} />}
        >
          Download
        </Button>
      }
    >
      <iframe
        src={urlQuery.data?.url || ''}
        style={{ width: '100%', height: '100%' }}
      />
    </Drawer>
  )
}

export default ReportPreviewDrawer
