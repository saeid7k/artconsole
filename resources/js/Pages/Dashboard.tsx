import AppLayout from "@/Layouts/AppLayout";
import { Card } from "antd";

function Dashboard({ }) {
  return (
    <Card>
      Dashboard Content
    </Card>
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
