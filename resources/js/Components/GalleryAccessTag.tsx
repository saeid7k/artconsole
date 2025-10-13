import { GalleryProps } from "@/types/gallery"
import { usePage } from "@inertiajs/react"
import { Tag } from "antd"

type Props = {
  gallery: GalleryProps,
  className?: string,
}

function GalleryAccessTag({gallery, className}: Props) {

  const { user } = usePage().props.auth

  const access = gallery.user_id == user.id ? 'owner' : gallery.pivot?.access || 'viewer'

  const colors: any = {
    'owner': 'gold',
    'editor': 'blue',
    'viewer': 'gray'
  }

  return (
    <Tag
      color={colors[access]}
      className={className}
    >
      {access}
    </Tag>
  )
}

export default GalleryAccessTag
