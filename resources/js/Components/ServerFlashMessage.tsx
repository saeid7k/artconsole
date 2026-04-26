import { usePage } from "@inertiajs/react";
import useMessage from "antd/es/message/useMessage";
import { useEffect } from "react";

function ServerFlashMessage() {
  const flash: any = usePage().props.flash;
  const [messageApi, messageContextHolder] = useMessage();

  useEffect(() => {
    if (
      !flash
      || localStorage.getItem('flash') === JSON.stringify(flash)
    ) {
      return;
    }

    if (flash?.type == 'success' && flash?.message) {
      messageApi.success(flash.message, 3);
    }
    if (flash?.type == 'error' && flash?.error) {
      messageApi.error(flash.error, 5);
    }
    localStorage.setItem('flash', JSON.stringify(flash));
  }, [flash]);

  return messageContextHolder;
}

export default ServerFlashMessage;
