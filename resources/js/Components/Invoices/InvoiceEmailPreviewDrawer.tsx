import useInvoice from "@/hooks/useInvoice";
import { InvoiceProps } from "@/types/invoice";
import { DownloadIcon, LinkSquare02Icon, PdfIcon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Divider, Drawer, Tooltip } from "antd";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  show: boolean;
  onClose: () => void;
  invoice: InvoiceProps;
}

function InvoiceEmailPreviewDrawer({ show, onClose, invoice }: Props) {

  const { previewEmailIsLoading, previewEmailContent, handleDownload, pdfIsLoading, pdfUrl } = useInvoice({
    invoice,
    triggerPreviewEmail: show,
    triggerDownload: show,
  });

  return (
    <Drawer
      title="Email Preview"
      open={show}
      onClose={onClose}
      extra={
        <Button
          type="primary"
          icon={<HugeiconsIcon icon={SentIcon} size={20} />}
        >
          Send
        </Button>
      }
      size={800}
    >
      {previewEmailIsLoading && (
        <LoadingSpinner size="large" />
      )}
      {previewEmailContent && (
        <div className="flex flex-col gap-5">

          {/* Header */}

          <Card size="small" >
            <div><span className="label me-3">To:</span>{invoice?.contact?.email}</div>
            <Divider size="small" />
            <div><span className="label me-3">Reply To:</span>{invoice?.gallery?.email}</div>
            <Divider size="small" />
            <div><span className="label me-3">Subject:</span><strong>{invoice?.email_subject}</strong></div>
          </Card>

          {/* Email Body */}

          <div dangerouslySetInnerHTML={{ __html: previewEmailContent }} />

          {/* Attachments */}

          <Card size="small" title="Attachments">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <FlexBox>
                  <HugeiconsIcon icon={PdfIcon} size={20} />
                  <code className="text-body">{invoice?.pdf_file_name}</code>
                </FlexBox>
                <FlexBox>
                  <Tooltip title="Open in new tab">
                    <Button
                      variant="text"
                      color="blue"
                      shape="circle"
                      icon={<HugeiconsIcon icon={LinkSquare02Icon} size={20} />}
                      onClick={() => pdfUrl ? window.open(pdfUrl, '_blank') : undefined}
                      loading={pdfIsLoading}
                    />
                  </Tooltip>
                  <Tooltip title="Download">
                    <Button
                      variant="text"
                      color="purple"
                      shape="circle"
                      icon={<HugeiconsIcon icon={DownloadIcon} size={20} />}
                      onClick={handleDownload}
                      loading={pdfIsLoading}
                    />
                  </Tooltip>
                </FlexBox>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Drawer>
  )
}

export default InvoiceEmailPreviewDrawer
