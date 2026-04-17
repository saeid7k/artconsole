import PageTitle from "@/Components/PageTitle";
import YourPlanCard from "@/Components/Subscription/YourPlanCard";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import AppLayout from "@/Layouts/AppLayout";
import { getQueryParam } from "@/utils/urlHelper";
import { useQuery } from "@tanstack/react-query";
import { Card, Empty, message } from "antd";
import axios from "axios";
import { useEffect, useRef } from "react";

function Subscription() {

  const isInitialRender = useRef(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Checkout Messages

  useEffect(() => {
    if (isInitialRender.current) {
      if (getQueryParam('checkout') === 'success') {
        messageApi.success('Checkout successful!');
      } else if (getQueryParam('checkout') === 'canceled') {
        messageApi.error('Checkout canceled.');
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

  const plan = subscriptionDataQuery.data?.plan ?? null;

  return (
    <SubscriptionProvider value={{ refetchData }} >
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
              size="small"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No upcoming invoices" />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <Card
              title="Billing Details"
              size="small"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No billing details on file" />
            </Card>
            <Card
              title="Payment Methods"
              size="small"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No payment methods on file" />
            </Card>
          </div>
        </div>
        <Card
          title="Invoices History"
          size="small"
        >
          <p>No invoices found.</p>
        </Card>
      </div>
    </SubscriptionProvider>
  );
}

Subscription.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default Subscription;
