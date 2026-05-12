import { getQueryParam } from "@/utils/urlHelper";
import { message } from "antd";
import { useEffect, useRef } from "react";

function TokenTopupNotification() {

  const isInitialRender = useRef(true);
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    if (isInitialRender.current) {
      if (getQueryParam('token-topup') === 'success') {
        messageApi.success('Token top-up successful!');
      } else if (getQueryParam('token-topup') === 'canceled') {
        messageApi.error('Token top-up canceled.');
      }
      isInitialRender.current = false;
    }
  }, []);

  return messageContextHolder;
}

export default TokenTopupNotification;
