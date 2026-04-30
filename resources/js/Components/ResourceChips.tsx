import { getInitials } from "@/utils/stringHelper"
import { Avatar, Tag } from "antd"

type Props = {
  image: string
  name: string
  onClose?: () => void
}

function ResourceChips({ image, name, onClose }: Props) {

  return (
    <Tag
      className="p-1"
      closable
      onClose={(e) => {
        if (onClose) {
          e.preventDefault();
          onClose()
        }
      }}
    >
      <Avatar
        src={image}
        size="small"
        className="me-1"
      >
        {getInitials(name)}
      </Avatar>
      {name}
    </Tag>
  )
}

export default ResourceChips
