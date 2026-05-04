import { dayjsUserTz } from "@/utils/dateTimeHelper"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import FlexBox from "./Containers/FlexBox"
import dayjs from "dayjs"

type Props = {
  value: string | null;
  showIcon?: boolean;
  showTime?: boolean;
  className?: string;
}

function StyledDate({ value, showIcon = true, showTime = true, className = "" }: Props) {

  if (!value) {
    return null
  }

  let date;
  if (typeof value === 'number' || /^\d+$/.test(value)) { // If it's a Unix timestamp
    date = dayjs.unix(Number(value));
  } else {
    date = dayjsUserTz(value);
  }

  return (
    <FlexBox className={`whitespace-nowrap ${className}`}>
      {showIcon && <HugeiconsIcon icon={Calendar03Icon} size={20} className="text-muted" />}
      <div>{date.format('MMM D ,YYYY')}</div>
      {showTime && <div className="text-muted">{date.format('h:mm A')}</div>}
    </FlexBox>
  )
}

export default StyledDate
