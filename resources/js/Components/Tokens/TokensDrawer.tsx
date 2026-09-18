import { UsePageProps } from "@/types/usePage";
import { formatNumber } from "@/utils/formatHelper";
import { Coins02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { Button, Divider, Drawer } from "antd";
import { useEffect, useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import Container from "../Containers/Container";
import FlexBox from "../Containers/FlexBox";
import TokenIcon from "../Icons/TokenIcon";
import TokenPackages from "./TokenPackages";
import TokensTransactions from "./TokensTransactions";

type Props = {
  open: boolean;
  onClose: () => void;
};

function TokensDrawer({ open, onClose }: Props) {

  const props = usePage<UsePageProps>()?.props;
  const user = props?.auth?.user;

  const [showPackages, setShowPackages] = useState(false);

  useEffect(() => {
    if (open) {
      router.reload({ only: ['auth.user'] });
    }
  }, [open]);

  const isProMode = import.meta.env.VITE_PRO_MODE === 'true';

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
        {isProMode && (
          <Button
            variant="outlined"
            color="green"
            icon={<HugeiconsIcon icon={Coins02Icon} size={16} />}
            onClick={() => setShowPackages(prev => !prev)}
          >
            Top Up
          </Button>
        )}
      </FlexBox>

      <AnimatedContainer condition={showPackages}
        type="fadeDown"
        className="my-5"
      >
        <TokenPackages />
      </AnimatedContainer>
      <Divider className="text-ghost" >Transactions</Divider>
      <TokensTransactions />
    </Drawer>
  );
}

export default TokensDrawer;
