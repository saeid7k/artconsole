import { InvoiceProps } from "@/types/invoice";
import { SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Divider, Drawer, message } from "antd";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  show: boolean;
  onClose: () => void;
  invoice: InvoiceProps;
}

function InvoiceEmailPreviewDrawer({ show, onClose, invoice }: Props) {

  const viewQuery = useQuery({
    queryKey: ['invoice', invoice.id, 'email-preview'],
    queryFn: () => axios.get(route('invoices.preview-email', invoice.id))
      .then(res => res.data)
      .catch(err => {
        message.error(err?.response?.data?.message || 'Failed to load email preview');
        return null;
      }),
    enabled: show
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
      {viewQuery.isLoading && (
        <LoadingSpinner size="large" />
      )}
      {viewQuery.data && (
        <div className="flex flex-col gap-5">
          <Card size="small" >
            <div><span className="label me-3">To:</span>{invoice?.contact?.email}</div>
            <Divider size="small" />
            <div><span className="label me-3">Reply To:</span>{invoice?.gallery?.email}</div>
            <Divider size="small" />
            <div><span className="label me-3">Subject:</span><strong>{invoice?.email_subject}</strong></div>
          </Card>
          <div dangerouslySetInnerHTML={{ __html: viewQuery.data }} />
        </div>
      )}
    </Drawer>
  )
}

export default InvoiceEmailPreviewDrawer
