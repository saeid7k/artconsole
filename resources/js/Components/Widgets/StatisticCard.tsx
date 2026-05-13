import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "antd";
import FlexBox from "../Containers/FlexBox";

type Props = {
  title: string;
  value: string | number;
  icon?: any;
};

function StatisticCard({ title, icon, value }: Props) {
  return (
    <Card
      size="small"
    >
      <div className="flex flex-col gap-1">
        <FlexBox className="text-muted" >
          {icon && <HugeiconsIcon icon={icon} size={20} />}
          <div>{title}</div>
        </FlexBox>
        <div className="text-2xl">
          {value}
        </div>
      </div>
    </Card>
  )
}

export default StatisticCard;
