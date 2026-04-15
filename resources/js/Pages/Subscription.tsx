import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { getQueryParam } from "@/utils/urlHelper";
import { message } from "antd";
import { useEffect, useRef } from "react";

function Subscription() {

  const isInitialRender = useRef(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isInitialRender.current) {
      if (getQueryParam('checkout') === 'success') {
        messageApi.success('Checkout successful!');
      } else if (getQueryParam('checkout') === 'canceled') {
        messageApi.error('Checkout canceled.');
      }
      isInitialRender.current = false;
    }
  }, [])

  return (
    <div>
      {contextHolder}
      <PageTitle
        title="Subscription"
      />
    </div>
  );
}

Subscription.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default Subscription;
