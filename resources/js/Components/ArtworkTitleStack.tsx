import { ArtworkProps } from "@/types/artwork";
import { Link } from "@inertiajs/react";
import { Tooltip } from "antd";
import FormattedEdition from "./FormattedEdition";
import { twMerge } from "tailwind-merge";

type Props = {
  artwork: ArtworkProps
  rootClassName?: string;
  artistTooltipPlacement?: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
  showEdition?: boolean;
  size?: "medium" | "large";
  serifTitle?: boolean;
  className?: string;
}

function ArtworkTitleStack({
  artwork,
  rootClassName,
  artistTooltipPlacement = "bottom",
  showEdition = true,
  size = "medium",
  serifTitle = false,
  className = '',
}: Props)
{

  const artistName = artwork.artist_data.full_name;

  const titleFontSizeClass = {
    medium: 'text-md',
    large: 'text-2xl'
  }

  const editionSize: any = {
    medium: 'xs',
    large: 'md'
  }

  return (
    <div className={`flex flex-col ${rootClassName || ''} ${className}`}>

      {/* Title */}

      <Link
        className={twMerge(
          'text-body font-semibold',
          titleFontSizeClass[size],
          serifTitle ? 'font-serif' : ''
        )}
        href={route('artworks.show', artwork.id)}
      >
        {artwork.title}
      </Link>

      {/* Artist */}

      <div>
        <span className="text-muted italic">by </span>
        {artwork.artist ? (
          <Tooltip title="View Artist Profile" mouseEnterDelay={0.5} placement={artistTooltipPlacement}>
            <Link
              className="text-accent"
              href={route('contacts.show', artwork.artist.id)}
            >
              {artistName}
            </Link>
          </Tooltip>

        ) : (
          <span className="text-accent">{artistName}</span>
        )}
      </div>

      {/* Edition */}

      {showEdition && (
        <div>
          <FormattedEdition
            edition={artwork.edition}
            size={editionSize[size]}
          />
        </div>
      )}
    </div>
  );
}

export default ArtworkTitleStack;
