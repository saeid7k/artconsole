import { InvoiceProps } from "@/types/invoice";
import { downloadFile } from "@/utils/downloadHelper";
import { PdfIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Divider, Drawer } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  invoice: InvoiceProps;
  show: boolean;
  onClose: () => void;
}

function InvoicePreviewDrawer({ invoice, show, onClose }: Props) {

  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const renderMutation = useMutation({
    mutationFn: () => axios.post(route('invoices.render', { invoice: invoice?.id })),
    onSuccess: (res: any) => {
      setHtmlContent(res.data);
    },
    onError: (err: any) => {
    }
  });

  function handleDownload() {
    if (!invoice) return;
    downloadFile({
      url: route('invoices.download', { invoice: invoice?.id }),
      fileName: `Invoice - ${invoice?.invoice_number}.pdf`
    })
  }

  useEffect(() => {
    if (show && invoice) {
      renderMutation.mutate();
    } else {
      setHtmlContent(null);
    }
  }, [show, invoice]);

  // Renders

  const renderTitle = () => {
    return (
      <FlexBox wrapping="wrap" >
        <div>Invoice</div>
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
      defaultSize={1280}
    >
      {renderMutation.isPending && (
        <LoadingSpinner size="large" className="py-20" />
      )}
      {(invoice && htmlContent) && (
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
          className="scale-75 xl:scale-90 origin-top-left"
        ></div>
      )}
    </Drawer>
  );
}

export default InvoicePreviewDrawer;
