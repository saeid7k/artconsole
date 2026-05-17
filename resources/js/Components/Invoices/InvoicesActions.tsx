import useInvoice from "@/hooks/useInvoice";
import { InvoiceProps } from "@/types/invoice";
import { Delete02Icon, Download01Icon, MailSend01Icon, MoreHorizontalCircle01Icon, Payment01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import InvoiceEmailPreviewDrawer from "./InvoiceEmailPreviewDrawer";
import InvoiceFormDrawer from "./InvoiceFormDrawer";
import InvoicePaymentsDrawer from "./InvoicePaymentsDrawer";

function InvoicesActions({ invoice } : { invoice: InvoiceProps }) {

  const user = usePage().props.auth.user;
  const { handleDownload } = useInvoice({ invoice });

  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showPaymentsDrawer, setShowPaymentsDrawer] = useState(false);
  const [showEmailPreviewDrawer, setShowEmailPreviewDrawer] = useState(false);

  // Delete

  const deleteQuery = useQuery({
    queryKey: ['delete-invoice', invoice.id],
    queryFn: () => axios.delete(route('invoices.delete', invoice.id))
      .then(res => {
        message.success('Invoice deleted successfully');
      })
      .catch(err => {
        message.error(err?.response?.data?.message || 'Failed to delete invoice');
      }),
    enabled: false
  });

  function handleDelete() {
    deleteQuery.refetch();
    router.reload();
  }

  return (
    <>
      <FlexBox>
        <Tooltip title="Edit">
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={PencilEdit02Icon} size={20} />}
            onClick={() => setShowEditDrawer(true)}
            disabled={!user?.has_edit_access}
          />
        </Tooltip>
        <Tooltip title="Payments">
          <Button
            variant="text"
            color='blue'
            shape="circle"
            icon={<HugeiconsIcon icon={Payment01Icon} size={20} />}
            onClick={() => setShowPaymentsDrawer(true)}
          />
        </Tooltip>
        <Tooltip title="Send as Email" placement="topRight">
          <Button
            variant="text"
            color='purple'
            shape="circle"
            icon={<HugeiconsIcon icon={MailSend01Icon} size={20} />}
            onClick={() => setShowEmailPreviewDrawer(true)}
          />
        </Tooltip>
        <Dropdown
          trigger={['click']}
          popupRender={() =>
            <Menu
              items={[
                {
                  key: 'download',
                  icon: <HugeiconsIcon icon={Download01Icon} size={16} />,
                  label: 'Download PDF',
                  onClick: handleDownload
                },
                {
                  key: 'delete',
                  icon: <HugeiconsIcon icon={Delete02Icon} size={16} />,
                  label: 'Delete Invoice',
                  onClick: handleDelete,
                  disabled: !user?.has_edit_access
                },
              ]}
            />
          }
        >
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={20} />}
          />
        </Dropdown>
      </FlexBox>

      {/* Components */}

      <InvoiceFormDrawer
        show={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        invoiceId={invoice.id}
      />

      <InvoicePaymentsDrawer
        show={showPaymentsDrawer}
        onClose={() => setShowPaymentsDrawer(false)}
        invoice={invoice}
      />

      <InvoiceEmailPreviewDrawer
        show={showEmailPreviewDrawer}
        onClose={() => setShowEmailPreviewDrawer(false)}
        invoice={invoice}
      />
    </>
  )
}

export default InvoicesActions;
