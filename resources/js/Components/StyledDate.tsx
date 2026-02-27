import { dayjsUserTz } from "@/utils/dateTimeHelper"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import FlexBox from "./Containers/FlexBox"

type Props = {
  value: string;
  showIcon?: boolean;
}

function StyledDate({ value, showIcon = true }: Props) {
  return (
    <FlexBox>
      {showIcon && <HugeiconsIcon icon={Calendar03Icon} size={20} className="text-muted" />}
      <div>{dayjsUserTz(value).format('MMM D ,YYYY')}</div>
      <div className="text-muted">{dayjsUserTz(value).format('h:mm A')}</div>
    </FlexBox>
  )
}

export default StyledDate
