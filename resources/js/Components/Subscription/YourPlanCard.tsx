import { useApp } from "@/contexts/AppContext"
import { useSubscription } from "@/contexts/SubscriptionContext"
import useSubscriptionQueries from "@/hooks/useSubscriptionQueries"
import { formatCurrency } from "@/utils/formatHelper"
import { Calendar02Icon, CreditCardPosIcon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Alert, Button, Card, Empty, Progress } from "antd"
import dayjs from "dayjs"
import { useEffect } from "react"
import BlockContainer from "../Containers/BlockContainer"
import DataRow from "../Containers/DataRow"
import SubscriptionStatusTag from "./SubscriptionStatusTag"

type Props = {
  plan: any
}

function YourPlanCard({ plan }: Props) {

  const {setOpenUpgradeModal, openUpgradeModal} = useApp();
  const { refetchData, dataIsLoading } = useSubscription();
  const { resumeSubscriptionMutation } = useSubscriptionQueries();

  const planStartDate = dayjs.unix(plan?.current_period_start).format('MMM D, YYYY') ?? null;
  const planEndDate = dayjs.unix(plan?.current_period_end).format('MMM D, YYYY') ?? null;
  const planEndDateTime = dayjs.unix(plan?.current_period_end).format('MMM D, YYYY h:mm A') ?? null;
  const planTimeElapsed = dayjs().diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDuration = dayjs.unix(plan?.current_period_end).diff(dayjs.unix(plan?.current_period_start), 'day') ?? null;
  const planDaysRemaining = plan ? dayjs.unix(plan.current_period_end).startOf('day').diff(dayjs().startOf('day'), 'day') : null;

  useEffect(() => {
    if (!openUpgradeModal) {
      refetchData();
    }
  }, [openUpgradeModal])

  async function handleResumeSubscription() {
    await resumeSubscriptionMutation.mutateAsync()
    refetchData()
    router.reload()
  }

  return (
    <Card
      title="Your Plan"
      extra={plan ? [
        <Button
          onClick={() => setOpenUpgradeModal(true)}
        >
          Change Plan
        </Button>
      ] : null}
      loading={dataIsLoading}
    >
      {(!dataIsLoading && !plan) ?
        (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
        )
        :
        (
          <>
            <div className="flex flex-col xl:flex-row gap-5 justify-between">
              <div className="flex flex-col gap-2">
                <BlockContainer >
                  <div className="flex gap-3">
                    <div className="font-semibold text-muted tracking-wide">{plan?.name}</div>
                    <SubscriptionStatusTag status={plan?.status} variant="solid" />
                  </div>
                  <div className="flex items-end gap-1">
                    <div className="text-xl">{formatCurrency(plan?.amount)}</div>
                    <div className="text-sm text-muted">/{plan?.interval} /member</div>
                  </div>
                </BlockContainer>
              </div>
              <div className="flex flex-col gap-3 grow max-w-[400px]">
                <DataRow
                  icon={<HugeiconsIcon icon={UserGroupIcon} />}
                  value={`${plan?.quantity} Members`}
                />
                <DataRow
                  icon={<HugeiconsIcon icon={Calendar02Icon} />}
                  label="Current Period:"
                  value={`${planStartDate} - ${planEndDate}`}
                />
                {plan?.auto_renew && (
                  <DataRow
                    icon={<HugeiconsIcon icon={CreditCardPosIcon} />}
                    label="Next Billing Time:"
                    value={planEndDateTime}
                  />
                )}
                <div className="flex items-center gap-3 mt-5">
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
                title={<div className="flex gap-2">
                  <div>Your subscription will be switched to the <strong>Free Plan</strong> at the end of the current billing period.</div>
                  <Button
                    size="small"
                    onClick={handleResumeSubscription}
                    loading={resumeSubscriptionMutation.isPending}
                  >Resume this plan</Button>
                </div>}
                type="warning"
                showIcon
                className="mt-10"
              />
            )}
          </>
        )}
    </Card>
  )
}

export default YourPlanCard
