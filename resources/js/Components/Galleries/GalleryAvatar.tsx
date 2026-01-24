import { GalleryProps } from "@/types/gallery"
import { getInitials } from "@/utils/stringHelper"
import { Avatar } from "antd"
import { twMerge } from "tailwind-merge"

type Props = {
  gallery: GalleryProps,
  size?: 'small' | 'default' | 'large' | number,
  shape?: 'square' | 'circle',
  shadow?: boolean,
  border?: boolean,
}

function GalleryAvatar({ gallery, size = 'default', shape = 'square', shadow, border }: Props) {

  const initials = getInitials(gallery?.name ?? 'LI')

  return (
    <Avatar
      src={gallery?.logo}
      shape={shape}
      size={size}
      className={twMerge(
        shadow ? 'shadow' : '',
        border ? 'border-1 border-solid border-gray-200' : '',
      )}
    >
      {initials}
    </Avatar>
  )
}

export default GalleryAvatar
