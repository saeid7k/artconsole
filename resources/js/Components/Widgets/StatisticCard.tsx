import { TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, Popover, Tag } from "antd";
import FlexBox from "../Containers/FlexBox";

type Props = {
  title: string;
  icon?: any;
  value: string | number | React.ReactNode;
  trend?: number | null;
  trendTooltip?: string | React.ReactNode;
  loading?: boolean;
};

function StatisticCard({ title, icon, value, trend, trendTooltip, loading }: Props) {
  return (
    <Card
      size="small"
      loading={loading}
    >
      <div className="flex flex-col gap-1">
        <FlexBox className="text-muted" >
          {icon && <HugeiconsIcon icon={icon} size={20} />}
          <div>{title}</div>
        </FlexBox>
        <FlexBox alignItems="end" gap={2}>
          <div className="text-2xl">
            {value}
          </div>
          {trend !== null && trend !== undefined && trend !== 0 && (
            <Popover content={trendTooltip} placement="bottom" mouseEnterDelay={0.5} >
              <Tag
                color={trend == 0 ? 'blue' : trend > 0 ? 'green' : 'red'}
              >
                <FlexBox>
                  <HugeiconsIcon icon={trend > 0 ? TradeUpIcon : TradeDownIcon} size={20} />
                  <div>{`${trend}%`}</div>
                </FlexBox>
              </Tag>
            </Popover>
          )}
        </FlexBox>
      </div>
    </Card>
  )
}

export default StatisticCard;
