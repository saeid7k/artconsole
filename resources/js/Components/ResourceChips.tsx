import colors from "@/Themes/theme"
import { AiResource } from "@/types/aiResource"
import { getInitials } from "@/utils/stringHelper"
import { Avatar, Tag } from "antd"
import { twMerge } from "tailwind-merge"

type Props = {
  resource: AiResource
  closable?: boolean
  onClose?: () => void
  selected?: boolean
}

function ResourceChips({ resource, closable = true, onClose, selected = false }: Props) {

  return (
    <Tag
      variant={selected ? 'solid' : 'filled'}
      color={selected ? colors.primary[500] : 'default'}
      className="p-1"
      closable={closable}
      onClose={(e) => {
        if (onClose) {
          e.preventDefault();
          onClose()
        }
      }}
    >
      <Avatar
        src={resource.image}
        size="small"
        className={twMerge(
          "me-1",
          selected ? "ring-1" : ""
        )}
      >
        {getInitials(resource.name)}
      </Avatar>
      {resource.name}
    </Tag>
  )
}

export default ResourceChips
