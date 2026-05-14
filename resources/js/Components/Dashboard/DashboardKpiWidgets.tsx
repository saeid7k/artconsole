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
    active_inventory_value?: number;
    revenue?: number;
    revenue_trend?: number | null;
    pending_invoices_count?: number;
    pending_invoices_amount?: number;
    sale_count?: number;
  }>({});

  const kpiDataQuery = useQuery({
    queryKey: ['kpi-data'],
    queryFn: () => axios.get(route('kpi-data')).then(res => res.data),
    staleTime: Infinity
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
        loading={kpiDataQuery.isLoading}
      />
      <StatisticCard
        title="Total Sales"
        value={data?.sale_count}
        icon={ShoppingBag}
        loading={kpiDataQuery.isLoading}
      />
      <StatisticCard
        title="Total Revenue"
        icon={MoneyReceive01Icon}
        value={formatCurrency(data?.revenue, gallery?.currency)}
        trend={data?.revenue_trend}
        trendTooltip={<div>Revenue change compared to previous period.<br />Last 30 days compared to previous 30 days.</div>}
        loading={kpiDataQuery.isLoading}
      />
      <StatisticCard
        title="Pending Invoices"
        icon={InvoiceIcon}
        value={
          <FlexBox gap={2}>
            <div className="font-light">{data?.pending_invoices_count}:</div>
            {formatCurrency(data?.pending_invoices_amount, gallery?.currency)}
          </FlexBox>
        }
        loading={kpiDataQuery.isLoading}
      />
    </div>
  )
}

export default DashboardKpiWidgets;
