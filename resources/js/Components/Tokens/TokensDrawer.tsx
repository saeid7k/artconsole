import { formatNumber } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { Divider, Drawer } from "antd";
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

  return (
    <Drawer
      title="Tokens Balance"
      onClose={onClose}
      open={open}
    >
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
      <Divider className="text-ghost" >Transactions</Divider>
      <TokensTransactions />
    </Drawer>
  );
}

export default TokensDrawer;
