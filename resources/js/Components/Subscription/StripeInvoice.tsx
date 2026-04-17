import { useSubscription } from "@/contexts/SubscriptionContext";
import { formatCurrency } from "@/utils/formatHelper";
import { Tag } from "antd";
import dayjs from "dayjs";

type Props = {
  invoice: any,
}

function StripeInvoice({ invoice }: Props) {

  const { plan } = useSubscription();

  const sortedItems = invoice?.lines?.data.sort((a: any, b: any) => {
    const aType = a.parent?.type
    const bType = b.parent?.type
    if (aType === 'subscription_item_details' && bType !== 'subscription_item_details') {
      return -1;
    } else if (aType !== 'subscription_item_details' && bType === 'subscription_item_details') {
      return 1;
    }
    return 0;
  });

  const taxTitle = invoice?.tax_rate?.display_name ? 'Tax (' + invoice?.tax_rate?.display_name + ' - ' + invoice?.tax_rate?.percentage + '%)' : 'Tax';

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Tag className="flex gap-1 text-sm" ><div className="label">Date:</div><div>{dayjs.unix(invoice?.next_payment_attempt).format('LL')}</div></Tag>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="text-start">Description</th>
            <th>Qty</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((line: any) => (
            <tr key={line.id}>
              <td>{(plan.id == line.pricing?.price_details?.price && plan?.name) ? plan.name : line.description}</td>
              <td className="text-center">{line.quantity ?? 1}</td>
              <td className="text-right">{formatCurrency(line.pricing.unit_amount_decimal / 100, invoice.currency, 2)}</td>
              <td className="text-right">{formatCurrency(line.amount / 100, invoice.currency, 2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right font-semibold">Subtotal</td>
            <td className="text-right font-semibold">{formatCurrency(invoice.subtotal / 100, invoice.currency, 2)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-right font-semibold">{taxTitle}</td>
            <td className="text-right font-semibold">{formatCurrency(invoice.total_taxes[0]?.amount / 100, invoice.currency, 2)}</td>
          </tr>
          <tr>
            <td colSpan={2}></td>
            <th className="text-right">Total</th>
            <th className="text-right">{formatCurrency(invoice.total / 100, invoice.currency, 2)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default StripeInvoice;
