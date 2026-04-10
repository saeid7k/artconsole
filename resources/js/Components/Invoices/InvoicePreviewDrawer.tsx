import useInvoice from "@/hooks/useInvoice";
import { InvoiceProps } from "@/types/invoice";
import { PdfIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Divider, Drawer } from "antd";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  invoice: InvoiceProps;
  show: boolean;
  onClose: () => void;
}

function InvoicePreviewDrawer({ invoice, show, onClose }: Props) {

  const { pdfUrl, pdfIsLoading, handleDownload } = useInvoice({
    invoice,
    triggerDownload: show,
  });

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
      onClose={onClose}
      title={renderTitle()}
      extra={renderToolbar()}
      resizable
      defaultSize={700}
      destroyOnHidden
    >
      {pdfIsLoading && (
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
