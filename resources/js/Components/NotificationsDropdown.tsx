import { NotificationProps } from "@/types/notification";
import { keyToTitle } from "@/utils/stringHelper";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge, Button, Dropdown, Menu } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function NotificationsDropdown() {

  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  function fetchNotifications() {
    axios.get(route('notifications.latest', { count: 5 }))
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch notifications:', error);
      });
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const popup = () => {
    return (
      <Menu className="min-w-[200px]">
        <div className="text-center p-1">Notifications</div>
        <Menu.Divider />
        {notifications.map((n) => (
          <Menu.Item
            key={n?.id}
          >
            <div className="flex items-center gap-1">
              <Badge color="blue" />
              <div>{keyToTitle(n?.type)}</div>
            </div>
            <div>{n?.data?.message}</div>
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown
      trigger={['click']}
      popupRender={popup}
    >
      <Button
        shape="circle"
        type="text"
      >
        <HugeiconsIcon icon={Notification01Icon} size={24} />
      </Button>
    </Dropdown>
  );
}

export default NotificationsDropdown;
