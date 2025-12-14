import ARTWORK_EDITIONS from "@/constants/artworkEditions";
import { ArtworkProps } from "@/types/artwork";
import { twMerge } from "tailwind-merge";

type Props = {
  edition: ArtworkProps["edition"];
  muted?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

function FormattedEdition({ edition, muted = true, size = 'xs' }: Props) {

  const sizeMap = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-md',
    'lg': 'text-lg',
  };

  return (
    <div
      className={twMerge(
        "flex gap-1",
        muted ? "text-muted" : "text-body",
        sizeMap[size],
      )}
    >
      <span>{ARTWORK_EDITIONS.find(e => e.value === edition?.type)?.label}</span>
      {edition?.type == 'limited' && (
        <span>{edition?.number}/{edition?.size}</span>
      )}
      {edition?.type == 'open' && (
        <span>#{edition?.number}</span>
      )}
    </div>
  );
}

export default FormattedEdition;
