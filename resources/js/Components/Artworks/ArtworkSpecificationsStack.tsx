import { ArtworkProps } from "@/types/artwork";
import FormattedDimensions from "../FormattedDimensions";

type Props = {
  artwork: ArtworkProps
}

function ArtworkSpecificationsStack({artwork}: Props) {

  const styledLabel = (label: string) => (
    <span className="text-muted">{label}</span>
  )

  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        {styledLabel("Mediums:")}
        <div className="max-w-[200px] line-clamp-1" title={artwork.mediums?.join(', ')}>
          {artwork.mediums?.join(', ')}
        </div>
      </div>
      <div className="flex gap-1">
        {styledLabel("Styles:")}
        <div className="max-w-[200px] line-clamp-1" title={artwork.styles?.join(', ')}>
          {artwork.styles?.join(', ')}
        </div>
      </div>
      <div className="flex gap-1">
        {styledLabel("Size:")}
        <FormattedDimensions dimensions={artwork?.dimensions || null} />
      </div>
    </div>
  );
}

export default ArtworkSpecificationsStack;
