import { ArtworkProps } from "@/types/artwork";
import { twMerge } from "tailwind-merge";
import ArtworkTitleStack from "./ArtworkTitleStack";
import { CheckmarkCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  artwork: ArtworkProps;
  isSelected?: boolean;
  size?: 'small' | 'default';
} & React.HTMLAttributes<HTMLDivElement>

function ArtworkSelectCard({ artwork, isSelected, size = 'default', ...props }: Props) {
  return (
    <div key={artwork.id}
      className={twMerge(
        "relative flex border hover:bg-primary-light cursor-pointer transition-all",
        isSelected && "bg-primary-light !border-primary"
      )}
      {...props}
    >
      {artwork.main_image_thumb_url && (
        <img
          src={artwork.main_image_thumb_url}
          alt={artwork.title}
          className={twMerge(
            "aspect-square object-cover",
            size === 'small' ? "w-8" : "w-20"
          )}
        />
      )}
      <div
        className="p-1"
      >
        <ArtworkTitleStack
          artwork={artwork}
          showArtist={size === 'small' ? false : true}
          showYear={size === 'small' ? false : true}
          showSigned={false}
          showEdition={false}
          showConsignment={false}
          disableLinks
        />
      </div>
      <HugeiconsIcon
        icon={CheckmarkCircleIcon}
        className={twMerge(
          "absolute right-1 top-1 hidden",
          isSelected && "block text-primary"
        )}
      />
    </div>
  )
}

export default ArtworkSelectCard
