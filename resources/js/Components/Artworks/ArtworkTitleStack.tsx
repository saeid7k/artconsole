import colors from "@/Themes/theme";
import { ArtworkProps } from "@/types/artwork";
import { Agreement01Icon, SignatureIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Popover, Tooltip } from "antd";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";
import FormattedEdition from "../FormattedEdition";
import NewTag from "../NewTag";

type Props = {
  artwork: ArtworkProps
  rootClassName?: string;
  linkedTitle?: boolean;
  serifTitle?: boolean;
  artistTooltipPlacement?: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
  showArtist?: boolean;
  showEdition?: boolean;
  showSigned?: boolean;
  showYear?: boolean;
  showConsignment?: boolean;
  size?: "medium" | "large";
  disableLinks?: boolean;
}

function ArtworkTitleStack({
  artwork,
  rootClassName,
  linkedTitle = true,
  serifTitle = false,
  artistTooltipPlacement = "bottom",
  showArtist = true,
  showEdition = true,
  showSigned = true,
  showYear = true,
  showConsignment = true,
  size = "medium",
  disableLinks = false,
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

  const consignmentIconSize = {
    medium: 16,
    large: 20
  }

  return (
    <div className={`flex flex-col ${rootClassName || ''}`}>

      {/* Title */}

      <FlexBox gap={2} >
        <Link
          className={twMerge(
            'text-body font-semibold',
            titleFontSizeClass[size],
            serifTitle ? 'font-serif' : '',
            (linkedTitle && !disableLinks) ? '' : 'pointer-events-none'
          )}
          href={route('artworks.show', artwork.id)}
        >
          {artwork.title}
        </Link>
        {showConsignment && artwork.ownership == 'consigned' && (
          <Popover
            title="Consigned Artwork"
            content={artwork.owner ? `Owner: ${artwork?.owner?.full_name || 'Unknown'}` : null}
            placement="right"
          >
            <HugeiconsIcon icon={Agreement01Icon} color={colors.gray[500]} size={consignmentIconSize[size]} />
          </Popover>
        )}
        <NewTag dateRef={artwork.created_at} />
      </FlexBox>

      {/* Artist */}

      {showArtist && (
        <div>
          <span className="text-muted italic">by </span>
          {artwork.artist ? (
            <Tooltip title="View Artist Profile" mouseEnterDelay={0.5} placement={artistTooltipPlacement}>
              <Link
                className={twMerge(
                  "text-accent",
                  disableLinks ? 'pointer-events-none' : ''
                )}
                href={route('contacts.show', artwork.artist.id)}
              >
                {artistName}
              </Link>
            </Tooltip>

          ) : (
            <span className="text-accent">{artistName}</span>
          )}
        </div>
      )}

      {/* Edition */}

      {showEdition && (
        <FlexBox gap={2}>
          <FormattedEdition
            edition={artwork.edition}
            size={editionSize[size]}
          />
          {showSigned && (
            <Popover
              title={artwork.signed ? "Signed Artwork" : "Not Signed Artwork"}
              content={artwork.signature_note || null}
              placement="right"
            >
              <HugeiconsIcon
                icon={SignatureIcon}
                size={16}
                color={artwork.signed ? colors.accent.DEFAULT : colors.muted.DEFAULT}
              />
            </Popover>
          )}
        </FlexBox>
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
