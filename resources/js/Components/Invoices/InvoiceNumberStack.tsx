import { InvoiceProps } from "@/types/invoice";
import { InvoiceIcon, PanelLeftOpen } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tooltip } from "antd";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import NewTag from "../NewTag";
import InvoicePreviewDrawer from "./InvoicePreviewDrawer";

type Props = {
  invoice: InvoiceProps;
  showNewTag?: boolean;
};

function InvoiceNumberStack({ invoice, showNewTag = true }: Props) {

  if (!invoice) {
    return null
  }

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
            <FlexBox>
              <HugeiconsIcon icon={InvoiceIcon} size={20} className="text-muted" />
              <code>{invoice.invoice_number}</code>
            </FlexBox>
          </Button>
        </Tooltip>
        {showNewTag && <NewTag dateRef={invoice.created_at} />}
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
