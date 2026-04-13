import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";

function Subscription() {
  return (
    <PageTitle
      title="Subscription"
    />
  );
}

Subscription.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default Subscription;
