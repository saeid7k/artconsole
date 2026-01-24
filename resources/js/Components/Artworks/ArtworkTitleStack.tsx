import { ArtworkProps } from "@/types/artwork";
import { Link } from "@inertiajs/react";
import { Tooltip } from "antd";
import { twMerge } from "tailwind-merge";
import FormattedEdition from "../FormattedEdition";

type Props = {
  artwork: ArtworkProps
  rootClassName?: string;
  linkedTitle?: boolean;
  serifTitle?: boolean;
  artistTooltipPlacement?: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
  showEdition?: boolean;
  showYear?: boolean;
  size?: "medium" | "large";
  className?: string;
}

function ArtworkTitleStack({
  artwork,
  rootClassName,
  linkedTitle = true,
  serifTitle = false,
  artistTooltipPlacement = "bottom",
  showEdition = true,
  showYear = true,
  size = "medium",
  className = '',
}: Props)
{

  const artistName = artwork.artist_data.full_name;

  const titleFontSizeClass = {
    medium: 'text-md',
    large: 'text-3xl'
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
          serifTitle ? 'font-serif' : '',
          linkedTitle ? '' : 'pointer-events-none'
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

      {/* Date */}
      {showYear && artwork.year && (
        <div className="text-muted">
          {artwork.year}
        </div>
      )}

    </div>
  );
}

export default ArtworkTitleStack;
