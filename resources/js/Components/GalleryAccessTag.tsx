import { getAccessLevelColor } from "@/constants/accessLevels"
import { Tag } from "antd"

type Props = {
  access: string | undefined,
  className?: string,
}

function GalleryAccessTag({access, className}: Props) {
  if (!access) {
    return null;
  }
  
  return (
    <Tag
      color={getAccessLevelColor(access)}
      className={className}
    >
      {access}
    </Tag>
  )
}

export default GalleryAccessTag
