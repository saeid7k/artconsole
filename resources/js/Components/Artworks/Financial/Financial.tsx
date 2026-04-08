import { ArtworkProps } from "@/types/artwork";
import ArtworkFinancialForm from "./FinancialForm";
import FinancialOwnedSummary from "./FinancialOwnedSummary";
import FinancialConsignedSummary from "./FinancialConsignedSummary";

function ArtworkFinancial({ artwork }: { artwork: ArtworkProps }) {
  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-2 items-start gap-10 max-w-[1000px]"
    >
      <div
        className="bg-light p-3 border !border-dashed rounded"
      >
        <ArtworkFinancialForm artwork={artwork} />
      </div>
      <div
        className="w-full overflow-x-auto"
      >
        {artwork.ownership === 'owned' && (
          <FinancialOwnedSummary artwork={artwork} />
        )}

        {artwork.ownership === 'consigned' && (
          <FinancialConsignedSummary artwork={artwork} />
        )}
      </div>
    </div>
  );
}

export default ArtworkFinancial;
