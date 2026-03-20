import { Button, Tooltip } from "antd";
import FlexBox from "../Containers/FlexBox";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { InvoiceProps } from "@/types/invoice";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import InvoiceFormDrawer from "./InvoiceFormDrawer";

function InvoicesActions({ invoice } : { invoice: InvoiceProps }) {

  const user = usePage().props.auth.user;

  const [showEditDrawer, setShowEditDrawer] = useState(false);

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
