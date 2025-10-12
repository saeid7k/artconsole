import { getInitials } from "@/utils/stringHelper"
import { Avatar } from "antd"
import { twMerge } from "tailwind-merge"

type Props = {
  gallery: any,
  size?: 'small' | 'default' | 'large',
  shadow?: boolean,
}

function GalleryAvatar({ gallery, size = 'default', shadow }: Props) {

  const initials = getInitials(gallery?.name ?? 'LI')

  return (
    <Avatar
      src={gallery?.logo}
      shape="square"
      size={size}
      className={twMerge(
        shadow ? 'shadow' : ''
      )}
    >
      {initials}
    </Avatar>
  )
}

export default GalleryAvatar
