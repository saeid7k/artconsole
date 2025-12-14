import { ArtworkProps } from "@/types/artwork";
import { Link } from "@inertiajs/react";
import { Tooltip } from "antd";

type Props = {
  artwork: ArtworkProps
  rootClassName?: string;
  artistTooltipPlacement?: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
}

function ArtworkTitleStack({ artwork, rootClassName, artistTooltipPlacement = "bottom" }: Props) {

  const artistName = artwork.artist_data.full_name;

  return (
    <div className={`flex flex-col ${rootClassName || ''}`}>
      <Link
        className="text-body font-semibold"
        href={route('artworks.show', artwork.id)}
      >
        {artwork.title}
      </Link>
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
    </div>
  );
}

export default ArtworkTitleStack;
