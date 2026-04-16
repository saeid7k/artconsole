import DataRow from "@/Components/Containers/DataRow";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { formatCurrency } from "@/utils/formatHelper";
import { getQueryParam } from "@/utils/urlHelper";
import { Calendar02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Card, Empty, message, Progress } from "antd";
import axios from "axios";
import dayjs from "dayjs";
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

  const plan = subscriptionDataQuery.data?.plan ?? null;
  const planStartDate = dayjs.unix(plan?.current_period_start).format('MMM D, YYYY') ?? null;
  const planEndDate = dayjs.unix(plan?.current_period_end).format('MMM D, YYYY') ?? null;
  const planTimeElapsed = dayjs().diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDuration = dayjs.unix(plan?.current_period_end).diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDaysRemaining = plan ? dayjs.unix(plan.current_period_end).startOf('day').diff(dayjs().startOf('day'), 'day') : null;

  return (
    <div>
      {contextHolder}
      <PageTitle
        title="Subscription"
      />
      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="grid grid-cols-1 gap-3">
            <Card
              title="Your Plan"
              size="small"
            >
              <div className="flex flex-col xl:flex-row gap-5 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="border !border-dashed rounded py-1 px-2 w-max bg-light">
                    <div className="font-semibold text-muted tracking-wide">{plan?.name}</div>
                    <div className="flex items-end gap-1">
                      <div className="text-xl">{formatCurrency(plan?.amount)}</div>
                      <div className="text-sm text-muted">/{plan?.interval} /member</div>
                    </div>
                  </div>
                  <DataRow
                    icon={<HugeiconsIcon icon={UserGroupIcon} />}
                    value={`${plan?.quantity} Members`}
                  />
                </div>
                <div className="flex flex-col gap-3 grow max-w-[400px]">
                  <DataRow
                    icon={<HugeiconsIcon icon={Calendar02Icon} />}
                    label="Current Period:"
                    value={`${planStartDate} - ${planEndDate}`}
                  />
                  <div className="flex items-center gap-3">
                    <Progress
                      percent={planTimeElapsed / planDuration * 100}
                      showInfo={false}
                      status="active"
                    />
                    <div className="whitespace-nowrap">{planDaysRemaining} days remaining</div>
                  </div>
                </div>
              </div>
            </Card>
            <pre>{JSON.stringify(subscriptionDataQuery.data, null, 2)}</pre>
            <Card
              title="Upcoming Invoice"
              size="small"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No upcoming invoices" />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-3">
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
    </div>
  );
}

Subscription.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default Subscription;
