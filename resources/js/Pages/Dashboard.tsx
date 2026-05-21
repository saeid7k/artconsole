import ArtworksStatusWidget from "@/Components/Dashboard/ArtworksStatusWidget";
import DashboardKpiWidgets from "@/Components/Dashboard/DashboardKpiWidgets";
import OwnershipWidget from "@/Components/Dashboard/OwnershipWidget";
import RecentArtworksWidget from "@/Components/Dashboard/RecentArtworksWidget";
import RecentNotesWidget from "@/Components/Dashboard/RecentNotesWidget";
import TopCustomersWidget from "@/Components/Dashboard/TopCustomersWidget";
import TopSellingArtistsWidget from "@/Components/Dashboard/TopSellingArtistsWidget";
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

      <div className="flex flex-col gap-3">

        {/* 1st Row: KPI Widgets */}
        <DashboardKpiWidgets />

        {/* 2nd Row: Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">

          {/* Left Col */}
          <div className="xl:col-span-3 grid grid-cols-1 xl:grid-cols-2 items-start h-min gap-3">
            <ArtworksStatusWidget />
            <OwnershipWidget />
            <RecentArtworksWidget />
            <TopSellingArtistsWidget />
          </div>

          {/* Right Col */}
          <div className="xl:col-span-1 flex flex-col gap-3">
            <RecentNotesWidget />
            <TopCustomersWidget />
          </div>
        </div>
      </div>

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
