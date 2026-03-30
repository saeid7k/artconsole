import { InvoiceProps } from "@/types/invoice";
import { downloadFile } from "@/utils/downloadHelper";
import { PdfIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer } from "antd";
import axios from "axios";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  invoice: InvoiceProps;
  show: boolean;
  onClose: () => void;
}

function InvoicePreviewDrawer({ invoice, show, onClose }: Props) {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const renderQuery = useQuery({
    queryKey: ['invoices', 'render', invoice?.id],
    queryFn: () => axios.get(route('invoices.download', { invoice: invoice?.id }), { responseType: 'blob' })
      .then(res => {
        let url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        return res.data;
      }),
    enabled: show && !!invoice,
  });

  function handleDownload() {
    if (!pdfUrl) return;
    downloadFile({
      url: pdfUrl,
      fileName: `Invoice - ${invoice?.invoice_number}.pdf`
    })
  }

  function handleClose() {
    setPdfUrl(null);
    onClose();
  }

  // Renders

  const renderTitle = () => {
    return (
      <FlexBox wrapping="wrap" >
        <div>Invoice Preview</div>
        <Divider orientation="vertical" />
        <div className="text-primary">{invoice?.invoice_number}</div>
      </FlexBox>
    )
  }

  const renderToolbar = () => {
    return (
      <Button
        type="primary"
        icon={<HugeiconsIcon icon={PdfIcon} size={20} />}
        onClick={handleDownload}
      >
        Download
      </Button>
    )
  }

  return (
    <Drawer
      open={show}
      onClose={handleClose}
      title={renderTitle()}
      extra={renderToolbar()}
      resizable
      defaultSize={1024}
    >
      {renderQuery.isFetching && (
        <LoadingSpinner size="large" className="py-20" />
      )}
      {(invoice && pdfUrl) && (
        <iframe
          src={pdfUrl || ''}
          className="w-full h-[80vh] border"
        ></iframe>
      )}
    </Drawer>
  );
}

export default InvoicePreviewDrawer;
