import { useApp } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/formatHelper"
import { Calendar02Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert, Button, Card, Progress } from "antd"
import dayjs from "dayjs"
import DataRow from "../Containers/DataRow"
import SubscriptionStatusTag from "./SubscriptionStatusTag"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { useEffect } from "react"

type Props = {
  plan: any
}

function YourPlanCard({ plan }: Props) {

  const {setOpenUpgradeModal, openUpgradeModal} = useApp();
  const { refetchData } = useSubscription();

  const planStartDate = dayjs.unix(plan?.current_period_start).format('MMM D, YYYY') ?? null;
  const planEndDate = dayjs.unix(plan?.current_period_end).format('MMM D, YYYY') ?? null;
  const planTimeElapsed = dayjs().diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDuration = dayjs.unix(plan?.current_period_end).diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDaysRemaining = plan ? dayjs.unix(plan.current_period_end).startOf('day').diff(dayjs().startOf('day'), 'day') : null;

  useEffect(() => {
    if (!openUpgradeModal) {
      refetchData();
    }
  }, [openUpgradeModal])

  return (
    <Card
      title="Your Plan"
      extra={[
        <Button
          onClick={() => setOpenUpgradeModal(true)}
        >
          Change Plan
        </Button>
      ]}
      loading={!plan}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-between">
        <div className="flex flex-col gap-2">
          <div className="border !border-dashed rounded p-2 w-max bg-light">
            <div className="flex gap-3">
              <div className="font-semibold text-muted tracking-wide">{plan?.name}</div>
              <SubscriptionStatusTag status={plan?.status} variant="solid" />
            </div>
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
      {plan?.cancel_at_period_end && (
        <Alert
          title="Your subscription will be switched to the Free Plan at the end of the current billing period."
          type="warning"
          showIcon
          className="mt-5"
        />
      )}
    </Card>
  )
}

export default YourPlanCard
