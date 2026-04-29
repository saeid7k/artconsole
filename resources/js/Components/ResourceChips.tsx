import { getInitials } from "@/utils/stringHelper"
import { Avatar, Tag } from "antd"

type Props = {
  image: string
  name: string
}

function ResourceChips({ image, name }: Props) {

  return (
    <Tag
      className="p-1"
      closable
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
