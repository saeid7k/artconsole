import CONFIGS from '@/constants/configs.json';
import { getCountryCodeByCurrency } from "@/constants/currencies";
import { useApp } from "@/contexts/AppContext";
import useSubscriptionQueries from "@/hooks/useSubscriptionQueries";
import { useWindow } from "@/hooks/useWindow";
import colors from "@/Themes/theme";
import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { AiMagicIcon, CheckmarkCircle02Icon, InfinityCircleIcon, MinusSignCircleIcon, OneCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Divider, message, Modal, Segmented, Select, Tag } from "antd";
import axios from "axios";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { twMerge } from 'tailwind-merge';
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  open: boolean;
  onClose: () => void;
}

function SelectPlanModal({ open, onClose }: Props) {

  const { currency: defaultCurrency } = useApp();
  const { props } = usePage<UsePageProps>();
  const gallery = props.current_gallery;
  const { windowWidth } = useWindow();
  const { resumeSubscriptionMutation, cancelSubscriptionMutation } = useSubscriptionQueries();

  const [billingCycle, setBillingCycle] = useState<"month" | "year">("month");
  const [currency, setCurrency] = useState<string>(defaultCurrency.toLowerCase());

  // Fetching and Mutations

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get(route('subscription.products')).then(res => res.data),
    enabled: open,
  });

  const subscribeMutation = useMutation({
    mutationKey: ["subscribe"],
    mutationFn: (priceId) => axios.post(route('subscription.subscribe'), {
      price_id: priceId
    }),
    onSuccess: (res) => {
      window.location.href = res.data.checkout_url;
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'An error occurred while creating the checkout session.');
    }
  });

  function handleResumeSubscription() {
    resumeSubscriptionMutation.mutate();
    onClose();
  }

  function handleCancelSubscription() {
    cancelSubscriptionMutation.mutate();
    onClose();
  }

  // Derived State

  const proProduct = productsQuery.data?.find((product: any) => product.title === "Pro");
  const proProductId = proProduct?.id;
  const proPriceId = proProduct?.prices.find((p: any) => p.interval === billingCycle).id;
  const proPriceAmount = proProduct?.prices.find((p: any) => p.interval === billingCycle).currency_options[currency]?.unit_amount;

  const subscribedProductId = gallery?.subscriptions[0]?.items[0]?.stripe_product
  const isSubscribedToPro = subscribedProductId === proProductId;

  const showFreeButton = isSubscribedToPro && !gallery?.on_grace_period;
  const showUpgradeButton = !isSubscribedToPro && !gallery?.on_grace_period;
  const showResumeButton = isSubscribedToPro && gallery?.on_grace_period;

  const currencyOptions = Object.entries(proProduct?.prices?.[0]?.currency_options ?? {}).map(([key, value]) => ({
    label: <div className="flex items-center gap-2">
      <ReactCountryFlag svg key={key} countryCode={getCountryCodeByCurrency(key) || ''} />
      <div>{key.toUpperCase()}</div>
    </div>,
    value: key
  }));

  // Renders

  const PricingCard = ({ title, price, children }: {
    title: string,
    price: number,
    children?: React.ReactNode
  }) => {
    let perMonthPrice = billingCycle === "year" ? price / 12 : price;
    return (
      <Card
        title={
          <div className="flex flex-col gap-2 items-start">
            <Tag
              variant="solid"
              color={price == 0 ? "gray" : "blue"}
              className="text-base"
            >
              {title}
            </Tag>
            <div className="flex items-end gap-1">
              <div className="text-4xl font-bold">
                {formatCurrency(perMonthPrice/100, currency, 0, 2, 'en-US')}
              </div>
              {price > 0 && (
                <div className="text-sm text-muted font-normal">/month /member</div>
              )}
            </div>
            {price > 0 && billingCycle === "year" && (
              <div>
                <div className="text-sm font-normal">Billed annually: {formatCurrency(price/100, currency, 0, 2, 'en-US')}</div>
              </div>
            )}
          </div>
        }
        styles={{
          header: {
            minHeight: "140px",
            alignItems: "start",
            justifyContent: "start",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }
        }}
        className="min-w-[280px] shadow hover:shadow-xl hover:scale-101 transition"
      >
        {children}
      </Card>
    )
  }

  const featureRow = ({ title, type = "check", color = "green", bold = false, description = null }: {
    title: string,
    type?: "check" | "disabled" | "ai" | "one" | "infinite",
    color?: "green" | "gray" | "purple" | "gold" | "blue",
    bold?: boolean,
    description?: string | null
  }) => {
    const colorVar = {
      "green": colors.green[600],
      "gray": colors.gray[500],
      "purple": colors.purple[600],
      "gold": colors.yellow[600],
      "blue": colors.blue[600],
    }
    const icon = {
      "check": CheckmarkCircle02Icon,
      "disabled": MinusSignCircleIcon,
      "ai": AiMagicIcon,
      "one": OneCircleIcon,
      "infinite": InfinityCircleIcon
    }
    return (
      <div className="flex items-center gap-1">
        <HugeiconsIcon
          icon={icon[type]}
          strokeWidth={1}
          color={colorVar[color]}
          size={20}
        />
        <div
          className={twMerge(
            "text-sm",
            type === "disabled" && "text-muted",
            bold && "font-semibold"
          )}
        >
            {title}
        </div>
        {description && <div className="text-ghost">{description}</div>}
      </div>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1024}
      title="Select Your Plan"
      footer={null}
      centered={windowWidth < 1024}
    >
      {productsQuery.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className="py-5"
        >
          <div className="flex gap-3">
            <Segmented
              options={[
                { label: "Monthly", value: "month" },
                { label: "Annual", value: "year" },
              ]}
              value={billingCycle}
              onChange={setBillingCycle}
              className='select-none'
            />
            <Select
              options={currencyOptions}
              defaultValue={defaultCurrency.toLowerCase()}
              labelRender={(props) => <ReactCountryFlag svg countryCode={getCountryCodeByCurrency(String(props.value)) || ''} />}
              popupMatchSelectWidth={false}
              onChange={(value) => setCurrency(value)}
            />
          </div>
          <div className="flex justify-center flex-wrap gap-10 mt-5">
            <PricingCard
              title="Free"
              price={0}
            >
              <div className="flex flex-col gap-2">
                {featureRow({ title: "Unlimited Members" })}
                {featureRow({ title: "Unlimited Artworks" })}
                {featureRow({ title: "Unlimited Locations" })}
                {featureRow({ title: "AI Assistant", type: "ai", description: '(no free tokens)' })}
                <Divider size='small' />
                {featureRow({ title: `${CONFIGS.app.name} Branding`, color: "gray" })}
              </div>
              {showFreeButton && (
                <>
                  <Button
                    variant="solid"
                    color="default"
                    className="mt-5 w-full"
                    onClick={handleCancelSubscription}
                    loading={cancelSubscriptionMutation.isPending}
                  >
                    Switch to Free
                  </Button>
                </>
              )}
            </PricingCard>

            <PricingCard
              title='Pro'
              price={proPriceAmount}
            >
              <div className="flex flex-col gap-2">
                {featureRow({ title: "Unlimited Members" })}
                {featureRow({ title: "Unlimited Artworks" })}
                {featureRow({ title: "Unlimited Locations" })}
                {featureRow({
                  title: "AI Assistant",
                  type: "ai",
                  color: "purple",
                  description: '+ 100 free tokens/month'
                })}
                <Divider size='small' />
                {featureRow({ title: `Remove ${CONFIGS.app.name} Branding` })}
                {featureRow({ title: "Priority Support" })}
              </div>
              {(showUpgradeButton || showResumeButton) && (
                <>
                  {showUpgradeButton && (
                    <>
                    <Button
                      variant="solid"
                      color="blue"
                      className="mt-5 w-full"
                      onClick={import.meta.env.PROD ? undefined : () => subscribeMutation.mutate(proPriceId)}
                      disabled={import.meta.env.PROD}
                    >
                      {import.meta.env.PROD ? 'Coming Soon' : 'Upgrade'}
                    </Button>
                    <div className="text-ghost mt-1">14 days money back guarantee</div>
                    </>
                  )}
                  {showResumeButton && (
                    <>
                    <Button
                      variant="solid"
                      color="blue"
                      className="mt-5 w-full"
                      onClick={handleResumeSubscription}
                      loading={resumeSubscriptionMutation.isPending}
                    >
                      Resume this Plan
                    </Button>
                    </>
                  )}
                </>
              )}
            </PricingCard>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default SelectPlanModal;
