import { ArtworkProps } from "@/types/artwork";
import FlexBox from "../Containers/FlexBox";
import InvoiceNumberStack from "../Invoices/InvoiceNumberStack";
import StyledCurrency from "../StyledCurrency";
import StyledDate from "../StyledDate";

function ArtworkFinancial({ artwork }: { artwork: ArtworkProps }) {

  const salePrice = artwork.last_invoice?.items?.find((i: any) => i.artwork_id == artwork.id)?.price ?? null
  const profitAmount = salePrice && artwork.acquisition_price ? salePrice - artwork.acquisition_price : null

  return (
    <div>
      <table className="all-border group">
        <tbody>
          <tr>
            <td>Acquisition</td>
            <td>
              {artwork.acquisition_price ? (
                <StyledDate
                  value={artwork.acquisition_date ?? null}
                  showTime={false}
                />
              ) : (
                <span className="text-ghost">No data</span>
              )}
            </td>
            <td className="min-w-[80px] text-right">
              {artwork.acquisition_price ? (
                <StyledCurrency
                  value={artwork.acquisition_price ?? null}
                />
              ) : (
                <span className="text-ghost">-</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Sale</td>
            <td>
              {artwork.last_invoice ? (
                <FlexBox gap={3}>
                  <StyledDate
                    value={artwork.last_invoice?.date ?? null}
                    showTime={false}
                  />
                  <InvoiceNumberStack invoice={artwork.last_invoice} />
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
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2} className="text-right" >{(profitAmount ?? 0) >= 0 ? "Profit" : "Loss"}</th>
            <th className="text-right">
              {profitAmount ? (
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
    </div>
  );
}

export default ArtworkFinancial;
