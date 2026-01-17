import { DimensionsProps } from "@/types/dimensions";
import { formatDimensions } from "@/utils/formatHelper";

type Props = {
  dimensions: DimensionsProps | null;
  showDepth?: boolean;
  className?: string;
}

function FormattedDimensions({ dimensions, showDepth = false, className = "" }: Props) {
  const dimensionString = formatDimensions({ dimensions, showDepth });

  return (
    <div
      className={className}
    >
      {dimensionString}
    </div>
  );
}

export default FormattedDimensions;
