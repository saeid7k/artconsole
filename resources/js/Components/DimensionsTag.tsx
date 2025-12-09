type Props = {
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  } | null;
  showDepth?: boolean;
}

function DimensionsTag({ dimensions, showDepth = false }: Props) {
  if (!dimensions) {
    return <span>N/A</span>;
  }

  const { width, height, depth, unit } = dimensions;
  const unitSymbol = unit === 'inches' ? '"' : unit === 'cm' ? ' cm' : '';
  let dimensionString = `${width}${unitSymbol} x ${height}${unitSymbol}`;
  if (showDepth && depth) {
    dimensionString += ` x ${depth}${unitSymbol}`;
  }

  return (
    <span>{dimensionString}</span>
  );
}

export default DimensionsTag;
