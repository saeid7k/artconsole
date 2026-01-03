import { ArtworkProps } from "@/types/artwork";
import { formatCurrency } from "@/utils/formatter";
import { router } from "@inertiajs/react";
import { useState } from "react";
import ArtworkStatusTag from "./ArtworkStatusTag";
import ArtworkTitleStack from "./ArtworkTitleStack";
import FormattedDimensions from "./FormattedDimensions";
import imagePlaceholder from '~/resources/images/image-placeholder.svg'
import { twMerge } from "tailwind-merge";

function ArtworkCard({ artwork }: { artwork: ArtworkProps }) {

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="overflow-hidden shadow-md"
    >
      <div className={!imageLoaded ? "min-h-[200px]" : ""}>
        <div className="relative">
          <img
            src={artwork.main_image_url ?? imagePlaceholder}
            alt={artwork.title}
            className={twMerge("relative block w-full cursor-pointer hover:scale-105 origin-bottom transition-transform duration-300",
              artwork.main_image_url ? "" : "opacity-70"
            )}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {router.visit(route('artworks.show', artwork.id))}}
          />
          <FormattedDimensions
            dimensions={artwork.dimensions}
            className="absolute bottom-0 left-0 bg-white dark:bg-black !bg-opacity-60 px-1 text-xs"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 p-2 text-center">
        <ArtworkTitleStack
          artwork={artwork}
          rootClassName="text-center"
          artistTooltipPlacement="right"
          showEdition={false}
        />
        <div className="flex justify-center items-center gap-2">
          <div>{formatCurrency(artwork.price, 0)}</div>
          <ArtworkStatusTag
            status={artwork.status}
            fontSize="xs"
          />
        </div>
      </div>
    </div>
  )
}

export default ArtworkCard;
