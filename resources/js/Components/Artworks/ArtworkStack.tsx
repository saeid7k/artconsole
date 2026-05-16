import { ArtworkProps } from "@/types/artwork";
import { twMerge } from "tailwind-merge";
import ArtworkTitleStack from "./ArtworkTitleStack";
import { CheckmarkCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ArtworkStatusTag from "./ArtworkStatusTag";

type Props = {
  artwork: ArtworkProps;
  isSelected?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline';
  rounded?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

function ArtworkStack({ artwork, isSelected, size = 'md', variant = 'outline', rounded = false, ...props }: Props) {

  const imageSizeClass = {
    xs: "w-8",
    sm: "w-14",
    md: "w-20",
    lg: "w-32",
  }

  return (
    <div key={artwork.id}
      className={twMerge(
        "relative flex items-start hover:!bg-primary-50 dark:hover:!bg-primary-900 cursor-pointer transition-all overflow-hidden",
        isSelected && "bg-primary-50 dark:bg-primary-900 !border-primary",
        variant === 'filled' && 'bg-soft',
        variant === 'outline' && 'border',
        rounded && 'rounded-md'
      )}
      {...props}
    >
      {artwork.main_image_thumb_url && (
        <img
          src={artwork.main_image_thumb_url}
          alt={artwork.title}
          className={twMerge(
            "aspect-square object-cover",
            imageSizeClass[size]
          )}
        />
      )}
      <div
        className="p-1 grow flex items-start justify-between"
      >
        <ArtworkTitleStack
          artwork={artwork}
          showArtist={size === 'xs' ? false : true}
          showYear={['lg', 'xl'].includes(size) ? true : false}
          showSigned={false}
          showEdition={false}
          showConsignment={false}
          disableLinks
        />
        {['sm', 'md', 'lg'].includes(size) && (
          <ArtworkStatusTag
            status={artwork.status}
            fontSize="xs"
          />
        )}
      </div>
      <HugeiconsIcon
        icon={CheckmarkCircleIcon}
        className={twMerge(
          "absolute right-1 bottom-1 hidden",
          isSelected && "block text-primary"
        )}
      />
    </div>
  )
}

export default ArtworkStack
