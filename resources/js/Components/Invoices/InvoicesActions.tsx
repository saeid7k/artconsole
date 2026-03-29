import { InvoiceProps } from "@/types/invoice";
import { Delete02Icon, MoreHorizontalCircle01Icon, Payment01Icon, PdfIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import InvoiceFormDrawer from "./InvoiceFormDrawer";
import InvoicePaymentsDrawer from "./InvoicePaymentsDrawer";

function InvoicesActions({ invoice } : { invoice: InvoiceProps }) {

  const user = usePage().props.auth.user;

  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showPaymentsDrawer, setShowPaymentsDrawer] = useState(false);

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
            disabled={!user.has_edit_access}
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
        <Tooltip title="Download PDF" placement="topRight">
          <Button
            variant="text"
            color='red'
            shape="circle"
            icon={<HugeiconsIcon icon={PdfIcon} size={20} />}
            // onClick={handleDownload}
          />
        </Tooltip>
        <Dropdown
          trigger={['click']}
          popupRender={() =>
            <Menu
              items={[
                {
                  key: 'delete',
                  icon: <HugeiconsIcon icon={Delete02Icon} size={16} />,
                  label: 'Delete Invoice',
                  onClick: handleDelete,
                  disabled: !user.has_edit_access
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
    </>
  )
}

export default InvoicesActions;
