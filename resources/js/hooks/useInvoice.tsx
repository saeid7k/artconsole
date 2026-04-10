import { InvoiceProps } from "@/types/invoice";
import { downloadFile } from "@/utils/downloadHelper";
import { router } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  invoice: InvoiceProps;
  triggerDownload?: boolean;
  triggerPreviewEmail?: boolean;
}

function useInvoice({ invoice, triggerDownload, triggerPreviewEmail }: Props) {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const downloadQuery = useQuery({
    queryKey: ['invoices', 'download', invoice?.id],
    queryFn: () => axios.get(route('invoices.download', { invoice: invoice?.id }), { responseType: 'blob' })
      .then(res => {
        let url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        return res.data;
      }),
    enabled: false,
  });

  async function handleDownload() {
    if (!pdfUrl) {
      const result = await downloadQuery.refetch();
      const data = result.data;
      if (data) {
        downloadFile({
          url: URL.createObjectURL(new Blob([data], { type: 'application/pdf' })),
          fileName: `Invoice - ${invoice?.invoice_number}.pdf`
        });
      }
      return;
    }
    downloadFile({
      url: pdfUrl,
      fileName: `Invoice - ${invoice?.invoice_number}.pdf`
    });
  }

  useEffect(() => {
    let cancelled = false;
    async function handleBoth() {
      await previewEmailQuery.refetch();
      if (!cancelled) {
        await downloadQuery.refetch();
      }
    }
    if (triggerDownload && triggerPreviewEmail) {
      handleBoth();
      return () => { cancelled = true; };
    } else if (triggerDownload) {
      downloadQuery.refetch();
    } else {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }
  }, [triggerDownload, triggerPreviewEmail]);

  const previewEmailQuery = useQuery({
    queryKey: ['invoices', 'preview-email', invoice?.id],
    queryFn: () => axios.get(route('invoices.preview-email', invoice.id))
      .then(res => res.data)
      .catch(err => {
        message.error(err?.response?.data?.message || 'Failed to load email preview');
        return null;
      }),
    enabled: false
  });

  useEffect(() => {
    if (triggerPreviewEmail) {
      previewEmailQuery.refetch();
    }
  }, [triggerPreviewEmail]);

  const sendEmailMutation = useMutation({
    mutationFn: () => axios.post(route('invoices.send-email', invoice.id)),
    onSuccess: (response) => {
      message.success(response.data.message || 'Invoice email is being sent.');
      router.reload();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to send invoice email');
    }
  });

  return {
    pdfUrl,
    pdfIsLoading: downloadQuery.isFetching,
    handleDownload,
    previewEmailIsLoading: previewEmailQuery.isFetching,
    previewEmailContent: previewEmailQuery.data,
    sendEmail: sendEmailMutation.mutate,
    sendEmailIsPending: sendEmailMutation.isPending,
  };
}

export default useInvoice;
