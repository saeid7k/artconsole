import { InvoiceProps } from "@/types/invoice";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import InvoiceFormDrawer from "./InvoiceFormDrawer";

function InvoicesActions({ invoice } : { invoice: InvoiceProps }) {

  const user = usePage().props.auth.user;

  const [showEditDrawer, setShowEditDrawer] = useState(false);

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
        <Tooltip title="Delete">
          <Button
            variant="text"
            color='danger'
            shape="circle"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            onClick={handleDelete}
            disabled={!user.has_edit_access}
          />
        </Tooltip>
      </FlexBox>

      {/* Components */}

      <InvoiceFormDrawer
        show={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        invoiceId={invoice.id}
      />
    </>
  )
}

export default InvoicesActions;
