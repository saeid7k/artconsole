import { UsePageProps } from "@/types/usePage";
import { formatCurrency, formatNumber } from "@/utils/formatHelper";
import { Coins01Icon, Coins02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import Container from "../Containers/Container";
import FlexBox from "../Containers/FlexBox";
import TokenIcon from "../Icons/TokenIcon";
import LoadingSpinner from "../LoadingSpinner";
import TokensTransactions from "./TokensTransactions";

type Props = {
  open: boolean;
  onClose: () => void;
};

function TokensDrawer({ open, onClose }: Props) {

  // Hooks

  const props = usePage<UsePageProps>()?.props;
  const user = props?.auth?.user;
  const currency = props?.current_gallery?.currency;

  // States

  const [showPackages, setShowPackages] = useState(false);

  // Queries

  const packagesQuery = useQuery({
    queryKey: ['tokenPackages'],
    queryFn: () => axios.get(route('tokens.packages')).then(res => res.data),
    enabled: showPackages,
    retry: false,
  });

  // Effects

  useEffect(() => {
    if (open) {
      router.reload({ only: ['auth.user'] });
    }
  }, [open]);

  // Derived states

  const packages = !packagesQuery.data ? [] : packagesQuery.data.sort((a: any, b: any) => a.tokens - b.tokens);

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
          onClick={() => setShowPackages(prev => !prev)}
        >
          Top Up
        </Button>
      </FlexBox>

      <AnimatedContainer condition={showPackages}
        type="fadeDown"
        className="my-5"
      >
        {packagesQuery.isLoading && <LoadingSpinner />}
        {!packagesQuery.isLoading && packages.length === 0 && (
          <Empty description="No packages available" className="my-5" />
        )}
        {packages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {packages.map((pkg: any) => {
              let iconQty = Math.round(pkg.tokens / 500);
              return (
                <Button
                  key={pkg.id}
                  variant="outlined"
                  color="default"
                  className="h-max py-1"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FlexBox>
                      {Array(iconQty).fill(null).map((_, i) => (
                        <HugeiconsIcon key={i} icon={Coins01Icon} size={24} strokeWidth={1} className="text-yellow-500" />
                      ))}
                    </FlexBox>
                    <div>{pkg.name}</div>
                    <div className="text-lg">{formatCurrency(pkg.currencies[currency.toLowerCase()] / 100, currency)}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        )}
      </AnimatedContainer>
      <Divider className="text-ghost" >Transactions</Divider>
      <TokensTransactions />
    </Drawer>
  );
}

export default TokensDrawer;
