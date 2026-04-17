import { useApp } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/formatHelper"
import { Calendar02Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Card, Progress } from "antd"
import dayjs from "dayjs"
import DataRow from "../Containers/DataRow"

type Props = {
  plan: any
}

function YourPlanCard({ plan }: Props) {

  const {setOpenUpgradeModal} = useApp();

  const planStartDate = dayjs.unix(plan?.current_period_start).format('MMM D, YYYY') ?? null;
  const planEndDate = dayjs.unix(plan?.current_period_end).format('MMM D, YYYY') ?? null;
  const planTimeElapsed = dayjs().diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDuration = dayjs.unix(plan?.current_period_end).diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDaysRemaining = plan ? dayjs.unix(plan.current_period_end).startOf('day').diff(dayjs().startOf('day'), 'day') : null;

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
  )
}

export default YourPlanCard
