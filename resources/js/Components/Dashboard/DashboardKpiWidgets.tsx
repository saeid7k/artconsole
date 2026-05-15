import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { GoldIcon, InvoiceIcon, MoneyReceive01Icon, ShoppingBag } from "@hugeicons/core-free-icons";
import { usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import StatisticCard from "../Widgets/StatisticCard";

function DashboardKpiWidgets() {

  const gallery = usePage<UsePageProps>().props.current_gallery

  const [data, setData] = useState<{
    active_inventory_value: number;
    revenue: number;
    revenue_trend: number | null;
    pending_invoices_count: number;
    pending_invoices_amount: number;
    sale_count: number;
    sale_count_trend: number | null;
  } | null>(null);

  const kpiDataQuery = useQuery({
    queryKey: ['kpi-data'],
    queryFn: () => axios.get(route('dashboard-data.kpi-data')).then(res => res.data),
    staleTime: Infinity
  });

  useEffect(() => {
    if (kpiDataQuery.data) {
      setData(kpiDataQuery.data);
    }
  }, [kpiDataQuery.data])

  return (
    <div className="w-full overflow-x-auto pb-2 sm:pb-0">
      <div className="grid grid-cols-4 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full min-w-max">
        <StatisticCard
          title="Active Inventory Value"
          value={formatCurrency(data?.active_inventory_value, gallery?.currency)}
          icon={GoldIcon}
          loading={kpiDataQuery.isLoading}
        />
        <StatisticCard
          title="Total Sales"
          value={data?.sale_count}
          trend={data?.sale_count_trend}
          trendTooltip={<div>Sales change.<br />Last 30 days compared to previous period.</div>}
          icon={ShoppingBag}
          loading={kpiDataQuery.isLoading}
        />
        <StatisticCard
          title="Total Revenue"
          icon={MoneyReceive01Icon}
          value={formatCurrency(data?.revenue, gallery?.currency)}
          trend={data?.revenue_trend}
          trendTooltip={<div>Revenue change.<br />Last 30 days compared to previous period.</div>}
          loading={kpiDataQuery.isLoading}
        />
        <StatisticCard
          icon={InvoiceIcon}
          title="Pending Invoices"
          titleBadge={(data?.pending_invoices_count ?? 0) > 0 ? data?.pending_invoices_count : undefined}
          value={
            <FlexBox gap={2}>
              {formatCurrency(data?.pending_invoices_amount, gallery?.currency)}
            </FlexBox>
          }
          loading={kpiDataQuery.isLoading}
        />
      </div>
    </div>
  )
}

export default DashboardKpiWidgets;
