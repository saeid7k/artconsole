import { MailIcon, SecurityWarningIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tooltip } from "antd";
import FlexBox from "../Containers/FlexBox";

type Props = {
  email: string;
  verified?: boolean;
}

function StyledEmail({ email, verified = true }: Props) {
  return (
    <FlexBox>
      <HugeiconsIcon icon={MailIcon} size={20} className="text-muted" />
      <span>{email}</span>
      {!verified &&
        <Tooltip title="Not Verified">
          <HugeiconsIcon icon={SecurityWarningIcon} size={16} className="text-yellow-600" />
        </Tooltip>
      }
    </FlexBox>
  );
}

export default StyledEmail;
