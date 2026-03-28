import { InvoiceProps } from "@/types/invoice";
import { router } from "@inertiajs/react";
import { Button, Divider, Drawer } from "antd";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import StyledCurrency from "../StyledCurrency";
import StyledDivider from "../StyledDivider";
import InvoicePaymentsTable from "./InvoicePaymentsTable";
import PaymentFormModal from "./PaymentFormModal";

type Props = {
  show: boolean;
  onClose: () => void;
  invoice: InvoiceProps;
};

function InvoicePaymentsDrawer({ show, onClose, invoice }: Props) {

  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  return (
    <>
      <Drawer
        title={<FlexBox>Payments<Divider orientation="vertical" /><div className="text-primary">{invoice.invoice_number}</div></FlexBox>}
        placement="right"
        onClose={onClose}
        open={show}
        size={500}
      >
        <InvoicePaymentsTable
          payments={invoice.payments || []}
          onUpdate={() => router.reload()}
        />
        <div className="flex justify-center mt-10">
          <Button
            type="primary"
            onClick={() => setOpenPaymentModal(true)}
          >
            Record a Payment
          </Button>
        </div>
        <StyledDivider rootClassName="mt-10" >Invoice Balance</StyledDivider>
        <div className="flex flex-col items-end box-border [&_.label]:mb-0">
          <div className="flex justify-end items-baseline gap-3 font-bold text-base" >
            <div className="label">Total:</div>
            <div className="w-[100px] text-end">
              <StyledCurrency value={invoice.total} />
            </div>
          </div>
          <div className="flex justify-end items-baseline gap-3" >
            <div className="label">Amount Paid:</div>
            <div className="w-[100px] text-end">
              <StyledCurrency value={invoice?.amount_paid} />
            </div>
          </div>
          <div className="flex justify-end items-baseline gap-3" >
            <div className="label">Amount Due:</div>
            <div className="w-[100px] text-end">
              <StyledCurrency value={invoice?.amount_due} />
            </div>
          </div>
        </div>
      </Drawer>

      {/* Components */}

      <PaymentFormModal
        open={openPaymentModal}
        onClose={() => {
          setOpenPaymentModal(false)
          router.reload()
        }}
        invoice={invoice}
      />
    </>
  );
}

export default InvoicePaymentsDrawer;
