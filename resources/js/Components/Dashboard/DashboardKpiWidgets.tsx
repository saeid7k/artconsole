import { UsePageProps } from "@/types/usePage";
import { formatCurrency, formatNumber } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import { HugeiconsIcon } from "@hugeicons/react";
import { GoldIcon, MoneyReceive01Icon } from "@hugeicons/core-free-icons";
import StatisticCard from "../Widgets/StatisticCard";

function DashboardKpiWidgets() {

  const gallery = usePage<UsePageProps>().props.current_gallery

  const [data, setData] = useState<{
    active_inventory_value?: number;
    revenue?: number;
  }>({});

  const kpiDataQuery = useQuery({
    queryKey: ['kpi-data'],
    queryFn: () => axios.get(route('kpi-data')).then(res => res.data),
    enabled: true,
  });

  useEffect(() => {
    if (kpiDataQuery.data) {
      setData(kpiDataQuery.data);
    }
  }, [kpiDataQuery.data])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <StatisticCard
        title="Active Inventory Value"
        value={formatCurrency(data?.active_inventory_value, gallery?.currency)}
        icon={GoldIcon}
      />
      <StatisticCard
        title="Total Revenue"
        value={formatCurrency(data?.revenue, gallery?.currency)}
        icon={MoneyReceive01Icon}
      />
      <Card>
        Pending Invoices
      </Card>
      <Card>
      </Card>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default DashboardKpiWidgets;
