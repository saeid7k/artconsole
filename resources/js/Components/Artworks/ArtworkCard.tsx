import { ArtworkProps } from "@/types/artwork";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import imagePlaceholder from '~/resources/images/image-placeholder.svg';
import FormattedDimensions from "../FormattedDimensions";
import StyledCurrency from "../StyledCurrency";
import ArtworkStatusTag from "./ArtworkStatusTag";
import ArtworkTitleStack from "./ArtworkTitleStack";

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
            className={twMerge(
              "relative block w-full max-h-[300px] object-cover cursor-pointer hover:scale-105 origin-bottom transition-transform duration-300",
              artwork.main_image_url ? "" : "opacity-70"
            )}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {router.visit(route('artworks.show', artwork.id))}}
          />
          <FormattedDimensions
            dimensions={artwork?.dimensions || null}
            className="absolute bottom-0 left-0 bg-white/50 dark:bg-black/50 !bg-opacity-60 px-1 text-xs"
          />
          <div className="absolute top-0.5 right-1">
            <ArtworkStatusTag
              status={artwork.status}
              fontSize="xs"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-2 text-center">
        <ArtworkTitleStack
          artwork={artwork}
          rootClassName="text-center justify-center items-center"
          artistTooltipPlacement="right"
          showEdition={false}
          showYear={false}
        />
        <StyledCurrency value={artwork.price} />
        <div className="flex justify-center items-center gap-2">
        </div>
      </div>
    </div>
  )
}

export default ArtworkCard;
