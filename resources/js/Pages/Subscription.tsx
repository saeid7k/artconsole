import PageTitle from "@/Components/PageTitle";
import BillingCard from "@/Components/Subscription/BillingCard";
import PaymentMethods from "@/Components/Subscription/PaymentMethods";
import StripeInvoice from "@/Components/Subscription/StripeInvoice";
import YourPlanCard from "@/Components/Subscription/YourPlanCard";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import AppLayout from "@/Layouts/AppLayout";
import { getQueryParam } from "@/utils/urlHelper";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, message, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useRef } from "react";

function Subscription({ billing_to }: { billing_to: string }) {

  const isInitialRender = useRef(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Checkout Messages

  useEffect(() => {
    if (isInitialRender.current) {
      if (getQueryParam('checkout') === 'success') {
        messageApi.success('Checkout successful!');
      } else if (getQueryParam('checkout') === 'canceled') {
        messageApi.error('Checkout canceled.');
      } else if (getQueryParam('add_payment_method') === 'success') {
        messageApi.success('Payment method added successfully!');
      } else if (getQueryParam('add_payment_method') === 'canceled') {
        messageApi.error('Adding payment method canceled.');
      }
      isInitialRender.current = false;
    }
  }, [])

  // Fetching Data

  const subscriptionDataQuery = useQuery({
    queryKey: ['subscriptionData'],
    queryFn: () => axios.get(route('subscription.data')).then(res => res.data),
    enabled: true,
    retry: false,
  });

  function refetchData() {
    subscriptionDataQuery.refetch();
  }

  const dataIsLoading = subscriptionDataQuery.isLoading;
  const subscriptionData = subscriptionDataQuery.data;
  const plan = subscriptionDataQuery.data?.plan ?? null;

  // Add Payment Method

  const getPaymentMethodLinkMutation = useMutation({
    mutationFn: () => axios.get(route('subscription.payment-method-link')).then(res => res.data),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to get payment method link')
    },
  })

  return (
    <SubscriptionProvider value={{ refetchData, dataIsLoading, subscriptionData, plan }} >
      {contextHolder}
      <PageTitle
        title="Subscription"
      />
      <div className="grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="grid grid-cols-1 gap-5">
            <YourPlanCard plan={plan} />
            <Card
              title="Upcoming Invoice"
              loading={dataIsLoading}
            >
              {(!dataIsLoading && !subscriptionDataQuery.data?.upcomingInvoice) ?
                (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No upcoming invoice" />
                )
                :
                (
                  <StripeInvoice
                    invoice={subscriptionDataQuery.data?.upcomingInvoice}
                  />
                )
              }
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <Card
              title="Payment Methods"
              loading={dataIsLoading}
              extra={dataIsLoading ? null : [
                <Tooltip title="Add Payment Method" >
                  <Button
                    type="text"
                    shape="circle"
                    icon={<HugeiconsIcon icon={AddIcon} />}
                    onClick={() => getPaymentMethodLinkMutation.mutate()}
                  />
                </Tooltip>
              ]}
            >
              {!dataIsLoading && !subscriptionDataQuery.data?.paymentMethods ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No payment methods found" />
              ) : (
                <PaymentMethods paymentMethods={subscriptionDataQuery.data?.paymentMethods ?? []} />
              )}
            </Card>
            <BillingCard billing_to={billing_to} />
          </div>
        </div>
        <Card
          title="Invoices History"
        >
          <p>No invoices found.</p>
        </Card>
      </div>
    </SubscriptionProvider>
  );
}

Subscription.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default Subscription;
