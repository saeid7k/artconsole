import { formatPhoneNumber } from "@/utils/formatHelper";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FlexBox from "../Containers/FlexBox";

type Props = {
  phone: string | null;
}

function StyledPhone({ phone }: Props) {
  return (
    <FlexBox>
      <HugeiconsIcon icon={Call02Icon} size={20} className="text-muted" />
      {formatPhoneNumber(phone)}
    </FlexBox>
  )
}

export default StyledPhone;
