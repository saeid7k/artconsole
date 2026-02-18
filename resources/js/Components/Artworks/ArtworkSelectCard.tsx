import { ArtworkProps } from "@/types/artwork";
import { twMerge } from "tailwind-merge";
import ArtworkTitleStack from "./ArtworkTitleStack";
import { CheckmarkCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  artwork: ArtworkProps;
  checkedItems?: ArtworkProps[];
  onClick?: (artwork: ArtworkProps) => void;
}

function ArtworkSelectCard({ artwork, checkedItems, onClick }: Props) {
  return (
    <div key={artwork.id}
      className={twMerge(
        "relative flex border hover:bg-primary-light cursor-pointer transition-all",
        checkedItems && checkedItems.find((c) => c.id === artwork.id) && "bg-primary-light !border-primary"
      )}
      onClick={onClick ? () => onClick(artwork) : undefined}
    >
      {artwork.main_image_thumb_url && (
        <img
          src={artwork.main_image_thumb_url}
          alt={artwork.title}
          className="w-20 aspect-square object-cover"
        />
      )}
      <div
        className="p-1"
      >
        <ArtworkTitleStack artwork={artwork} showSigned={false} showEdition={false} showConsignment={false} disableLinks />
      </div>
      <HugeiconsIcon
        icon={CheckmarkCircleIcon}
        className={twMerge(
          "absolute right-1 top-1 hidden",
          checkedItems && checkedItems.find((c: any) => c.id === artwork.id) && "block text-primary"
        )}
      />
    </div>
  )
}

export default ArtworkSelectCard
