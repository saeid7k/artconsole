import { usePage } from "@inertiajs/react";
import { message } from "antd";
import { useEffect } from "react";

function ServerFlashMessage() {
  const flash: any = usePage().props.flash;

  useEffect(() => {
    if (
      !flash
      || localStorage.getItem('flash') === JSON.stringify(flash)
    ) {
      return;
    }

    if (flash?.type == 'success' && flash?.message) {
      message.success(flash.message, 3);
    }
    if (flash?.type == 'error' && flash?.error) {
      message.error(flash.error, 5);
    }
    localStorage.setItem('flash', JSON.stringify(flash));
  }, [flash]);

  return null;
}

export default ServerFlashMessage;
