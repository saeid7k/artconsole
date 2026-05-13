import DashboardKpiWidgets from "@/Components/Dashboard/DashboardKpiWidgets";
import TokenTopupNotification from "@/Components/Tokens/TokenTopupNotification";
import AppLayout from "@/Layouts/AppLayout";
import { UsePageProps } from "@/types/usePage";
import { usePage } from "@inertiajs/react";

function Dashboard({}) {

  const { user } = usePage<UsePageProps>().props.auth;

  return (
    <div>
      <div className="mb-3 ps-3 text-lg">
        Hello, {user?.firstname}
      </div>

      <DashboardKpiWidgets />

      <TokenTopupNotification />
    </div>
  )
}

Dashboard.layout = (page: any) => {
  return (
    <AppLayout title="Dashboard" >
      {page}
    </AppLayout>
  )
}

export default Dashboard
