import colors from "@/Themes/theme";
import { formatNumber } from "@/utils/formatHelper";
import { TokenCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Button, Tooltip } from "antd";

function TokensCounter() {

  const user = usePage().props.auth.user

  return (
    <Tooltip title="Token Balance" mouseEnterDelay={1} >
      <Button
        variant="outlined"
        color="gold"
        className="border-gray-300 dark:border-gray-700 text-body hover:!text-yellow-600 px-2"
      >
        <HugeiconsIcon icon={TokenCircleIcon} size={20} color={colors.yellow[600]} />
        <div className="font-mono">{formatNumber(user.token_balance)}</div>
      </Button>
    </Tooltip>
  )
}

export default TokensCounter;
