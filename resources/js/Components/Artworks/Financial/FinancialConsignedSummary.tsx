import { ArtworkProps } from "@/types/artwork";
import FlexBox from "../../Containers/FlexBox";
import InvoiceNumberStack from "../../Invoices/InvoiceNumberStack";
import StyledCurrency from "../../StyledCurrency";
import StyledDate from "../../StyledDate";

function FinancialConsignedSummary({ artwork }: { artwork: ArtworkProps }) {

  const salePrice = artwork.last_invoice?.items?.find((i: any) => i.artwork_id == artwork.id)?.price ?? null
  const galleryShare = artwork.commission_mode === 'percentage' && artwork.commission_value ?
    (salePrice ? (artwork.commission_value / 100) * salePrice : null)
    :
    artwork.commission_value ?? null
  const consignorShare = (salePrice && galleryShare !== null) ? salePrice - galleryShare : null
  const profitAmount = salePrice && consignorShare !== null ? salePrice - consignorShare : null

  return (
    <table className="all-border group">
      <tbody>
        <tr>
          <td>Sale</td>
          <td>
            {artwork.last_invoice ? (
              <FlexBox gap={3}>
                <StyledDate
                  value={artwork.last_invoice?.date ?? null}
                  showTime={false}
                />
                <InvoiceNumberStack invoice={artwork.last_invoice} showNewTag={false} />
              </FlexBox>
            ) : (
              <span className="text-ghost">No data</span>
            )}
          </td>
          <td className="text-right">
            {artwork.last_invoice ? (
              <StyledCurrency
                value={salePrice}
              />
            ) : (
              <span className="text-ghost">-</span>
            )}
          </td>
        </tr>
        <tr>
          <td>Consignor Share</td>
          <td className="text-muted" >
            Sale Price - Gallery Commission
          </td>
          <td className="min-w-[80px] text-right">
            {consignorShare !== null ? (
              <StyledCurrency value={consignorShare} />
            ) : (
              <span className="text-ghost">-</span>
            )}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={2} className="text-right" >{(profitAmount ?? 0) >= 0 ? "Profit" : "Loss"}</th>
          <th className="text-right">
            {profitAmount !== null ? (
              <StyledCurrency
                value={profitAmount}
                greenOnPositive
              />
            ) : (
              <span className="text-ghost">-</span>
            )}
          </th>
        </tr>
      </tfoot>
    </table>
  )
}

export default FinancialConsignedSummary;
