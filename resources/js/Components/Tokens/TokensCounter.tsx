import { useApp } from "@/contexts/AppContext";
import { formatNumber } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { Button, Tooltip } from "antd";
import TokenIcon from "../Icons/TokenIcon";

function TokensCounter({ showBalance = true }: { showBalance?: boolean }) {

  const user = usePage().props.auth.user
  const { setTokensDrawerOpen } = useApp()

  return (
    <Tooltip title="Token Balance" mouseEnterDelay={1} >
      <Button
        variant="outlined"
        color="gold"
        className="border-gray-300 dark:border-gray-700 text-body hover:!text-yellow-600"
        icon={<TokenIcon />}
        onClick={() => setTokensDrawerOpen(true)}
      >
        {showBalance && <div className="font-mono">{formatNumber(user.token_balance)}</div>}
      </Button>
    </Tooltip>
  )
}

export default TokensCounter;
