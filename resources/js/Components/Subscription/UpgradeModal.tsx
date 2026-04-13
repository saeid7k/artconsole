import { getCountryCodeByCurrency } from "@/constants/currencies";
import { formatCurrency } from "@/utils/formatHelper";
import { useQuery } from "@tanstack/react-query";
import { Card, Divider, Modal, Segmented, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  open: boolean;
  onClose: () => void;
}

function UpgradeModal({ open, onClose }: Props) {

  const [billingCycle, setBillingCycle] = useState<"month" | "year">("month");
  const [currency, setCurrency] = useState<string>('cad');

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get(route('subscription.products')).then(res => res.data),
    enabled: open,
  });

  const currencyOptions = Object.entries(productsQuery.data?.[0]?.prices?.[0]?.currency_options ?? {}).map(([key, value]) => ({
    label: <div className="flex items-center gap-2">
      <ReactCountryFlag svg key={key} countryCode={getCountryCodeByCurrency(key) || ''} />
      <div>{key.toUpperCase()}</div>
    </div>,
    value: key
  }));

  const PricingCard = ({ title, price, children }: {
    title: string,
    price: number,
    children?: React.ReactNode
  }) => {
    let perMonthPrice = billingCycle === "year" ? price / 12 : price;
    return (
      <Card
        title={
          <div>
            <div className="text-lg">{title}</div>
            <div className="text-4xl font-bold">
              {formatCurrency(perMonthPrice/100, currency, 2, 'en-US')}
            </div>
            {price > 0 && (
              <div className="text-sm text-muted">
                /month /member
              </div>
            )}
          </div>
        }
        styles={{
          header: {
            minHeight: "120px",
            alignItems: "start",
            justifyContent: "start",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }
        }}
        style={{
          minWidth: "250px",
        }}
      >
        {children}
      </Card>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1024}
      title="Select your plan"
    >
      {productsQuery.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className="pt-5"
        >
          <div className="flex gap-3">
            <Segmented
              options={[
                { label: "Monthly", value: "month" },
                { label: "Yearly", value: "year" },
              ]}
              value={billingCycle}
              onChange={setBillingCycle}
            />
            <Select
              options={currencyOptions}
              defaultValue='usd'
              labelRender={(props) => <ReactCountryFlag svg countryCode={getCountryCodeByCurrency(String(props.value)) || ''} />}
              popupMatchSelectWidth={false}
              onChange={(value) => setCurrency(value)}
            />
          </div>
          <div className="flex justify-center flex-wrap gap-5 mt-5">
            <PricingCard
              title="Free"
              price={0}
            >
            </PricingCard>
            {productsQuery.data?.map((product: any) => {
              let price = product.prices.find((p: any) => p.interval === billingCycle).currency_options[currency].unit_amount;
              return (
                <PricingCard
                  key={product.id}
                  title={product.title}
                  price={price}
                >
                  {product.id}
                </PricingCard>
              )
            })}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default UpgradeModal;
