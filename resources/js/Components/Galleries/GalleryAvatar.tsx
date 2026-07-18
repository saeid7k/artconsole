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

  const logoUrl = () => {
    if (typeof size === 'number' && size > 200) {
      return gallery?.logo
    } else if (
      ['large', 'default'].includes(String(size))
      || (typeof size === 'number' && size > 40)
    ) {
      return gallery?.logo_thumb
    } else {
      return gallery?.logo_small
    }
  }

  return (
    <Avatar
      src={logoUrl()}
      shape={shape}
      size={size}
      className={twMerge('[&_img]:object-contain',
        shadow ? 'shadow' : '',
        border ? 'border-1 border-solid border-gray-200' : '',
      )}
    >
      {initials}
    </Avatar>
  )
}

export default GalleryAvatar
