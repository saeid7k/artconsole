import { formatNumber } from "@/utils/formatHelper";
import { Coins02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Button, Divider, Drawer } from "antd";
import { useEffect } from "react";
import Container from "../Containers/Container";
import FlexBox from "../Containers/FlexBox";
import TokenIcon from "../Icons/TokenIcon";
import TokensTransactions from "./TokensTransactions";

type Props = {
  open: boolean;
  onClose: () => void;
};

function TokensDrawer({ open, onClose }: Props) {

  const user = usePage()?.props?.auth?.user;

  useEffect(() => {
    if (open) {
      router.reload({ only: ['auth.user'] });
    }
  }, [open]);

  return (
    <Drawer
      title="Tokens Balance"
      onClose={onClose}
      open={open}
      destroyOnHidden
    >
      <FlexBox justifyContent="between" >
        <Container
          label="Available"
          contentClassName="font-mono text-2xl leading-none"
          bordered={false}
        >
          <FlexBox alignItems="end" gap={2}>
            {formatNumber(user?.token_balance)}
            <TokenIcon />
          </FlexBox>
        </Container>
        <Button
          variant="outlined"
          color="green"
          icon={<HugeiconsIcon icon={Coins02Icon} size={16} />}
        >
          Top Up
        </Button>
      </FlexBox>
      <Divider className="text-ghost" >Transactions</Divider>
      <TokensTransactions />
    </Drawer>
  );
}

export default TokensDrawer;
