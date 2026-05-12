import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { Coins01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Empty, message } from "antd";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";

function TokenPackages() {

  const props = usePage<UsePageProps>()?.props;
  const currency = props?.current_gallery?.currency;

  const packagesQuery = useQuery({
    queryKey: ['tokenPackages'],
    queryFn: () => axios.get(route('tokens.packages')).then(res => res.data),
    retry: false,
    staleTime: Infinity,
  });

  const packages = !packagesQuery.data ? [] : packagesQuery.data.sort((a: any, b: any) => a.tokens - b.tokens);

  const checkoutMutation = useMutation({
    mutationKey: ['checkout'],
    mutationFn: (priceId: number) => axios.post(route('tokens.checkout', { price_id: priceId })).then(res => res.data),
    onSuccess: (data) => {
      window.location.href = data.checkout_url;
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'An error occurred while creating the checkout session.');
    }
  });

  return (
    <>
      {packagesQuery.isLoading && <LoadingSpinner />}
      {
        !packagesQuery.isLoading && packages.length === 0 && (
          <Empty description="No packages available" className="my-5" />
        )
      }
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
                onClick={() => checkoutMutation.mutate(pkg.price_id)}
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
    </>
  )
}

export default TokenPackages
