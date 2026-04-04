import { InvoiceProps } from "@/types/invoice";
import FlexBox from "../Containers/FlexBox";
import { Button, Tooltip } from "antd";
import { useState } from "react";
import InvoicePreviewDrawer from "./InvoicePreviewDrawer";
import { PanelLeftOpen } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import NewTag from "../NewTag";

type Props = {
  invoice: InvoiceProps;
};

function InvoiceNumberStack({ invoice }: Props) {

  const [showInvoicePreviewDrawer, setShowInvoicePreviewDrawer] = useState(false)
  const [previewingInvoice, setPreviewingInvoice] = useState<InvoiceProps | null>(null)

  return (
    <>
      <FlexBox>
        <Tooltip title='Preview Invoice' mouseEnterDelay={1} >
          <Button
            type="text"
            size="small"
            onClick={() => {
              setPreviewingInvoice(invoice)
              setShowInvoicePreviewDrawer(true)
            }}
            icon={<HugeiconsIcon icon={PanelLeftOpen} size={20} className="text-muted opacity-0 group-hover:!opacity-100 transition" />}
            iconPlacement="end"
          >
            <code>{invoice.invoice_number}</code>
          </Button>
        </Tooltip>
        <NewTag dateRef={invoice.created_at} />
      </FlexBox>

      {/* Components */}

      <InvoicePreviewDrawer
        show={showInvoicePreviewDrawer}
        onClose={() => setShowInvoicePreviewDrawer(false)}
        invoice={previewingInvoice as InvoiceProps}
      />
    </>
  )
}

export default InvoiceNumberStack;
