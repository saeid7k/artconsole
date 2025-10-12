import { usePage } from "@inertiajs/react"
import { Tag } from "antd"

function GalleryAccessTag({gallery, className}: any) {

  const { user } = usePage().props.auth

  const access = gallery.user_id == user.id ? 'Owner' : gallery.pivot.access

  const colors: any = {
    'Owner': 'gold',
    'Editor': 'blue',
    'Viewer': 'gray'
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
