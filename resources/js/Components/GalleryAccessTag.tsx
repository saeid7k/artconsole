import { getAccessLevelColor } from "@/constants/accessLevels"
import { GalleryProps } from "@/types/gallery"
import { Tag } from "antd"

type Props = {
  gallery: GalleryProps,
  className?: string,
}

function GalleryAccessTag({gallery, className}: Props) {
  return (
    <Tag
      color={getAccessLevelColor(gallery.pivot?.access)}
      className={className}
    >
      {gallery.pivot?.access}
    </Tag>
  )
}

export default GalleryAccessTag
