import TokenTopupNotification from "@/Components/Tokens/TokenTopupNotification";
import AppLayout from "@/Layouts/AppLayout";
import { Card } from "antd";

function Dashboard({ }) {


  return (
    <div>
      <Card>
        Dashboard Content
      </Card>

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
