import { useApp } from "@/contexts/AppContext";
import { NotificationProps } from "@/types/notification";
import { keyToTitle } from "@/utils/stringHelper";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Badge, Button, Dropdown, Empty, Menu } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function NotificationsDropdown() {

  const { intervalData } = useApp();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (intervalData.latest_notifications && Array.isArray(intervalData['latest_notifications'])) {
      setNotifications(intervalData.latest_notifications);
    }
    if (intervalData.unread_notifications_count !== undefined) {
      setUnreadCount(intervalData.unread_notifications_count);
    }
  }, [intervalData]);

  function handleClickItem(notification: NotificationProps) {
    if (notification.data?.route) {
      router.visit(route(notification.data.route));
    }
    if (!notification.read_at) {
      axios.post(route('notifications.mark-as-read', notification.id))
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, read_at: dayjs().toISOString() } : n
            )
          );
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        })
        .catch((error) => {
          console.error('Failed to mark notification as read:', error);
        });
    }
  }

  function handleMarkAllAsRead() {
    axios.post(route('notifications.mark-all-as-read'))
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: dayjs().toISOString() }))
        );
        setUnreadCount(0);
      })
      .catch((error) => {
        console.error('Failed to mark all notifications as read:', error);
      });
  }

  function handleViewAll() {
    router.visit(route('notifications.index'));
    setDropdownOpen(false);
  }

  const popup = () => {
    return (
      <Menu className="min-w-[200px] max-w-[400px]">
        <div className="flex justify-between px-2 py-1">
          <div className="flex gap-1">
            <div className="font-semibold tracking-widest">Notifications</div>
            <Badge
              size="small"
              count={unreadCount}
            />
          </div>
          <Button
            size="small"
            type="default"
            className={
              unreadCount === 0 ? 'hidden' : ''
            }
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        <Menu.Divider />
        {notifications.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Notifications" />
        )}
        {notifications.map((n) => (
          <Menu.Item
            key={n?.id}
            className={twMerge(
              'text-sm',
              !n?.read_at ? 'bg-blue-100' : ''
            )}
            onClick={() => handleClickItem(n)}
          >
            <div className="flex items-center gap-1">
              <Badge color="blue" className={!n?.read_at ? '' : 'hidden'} />
              <div
                className={!n?.read_at ? 'font-bold' : 'font-normal'}
              >{keyToTitle(n?.type)}</div>
            </div>
            <div
              className={twMerge(
                'line-clamp-1',
                n?.read_at ? 'text-ghost' : ''
              )}
            >
              {n?.data?.message}
            </div>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Button
          type="link"
          className="w-full"
          onClick={handleViewAll}
        >
          View All Notifications
        </Button>
      </Menu>
    );
  };

  return (
    <Dropdown
      trigger={['click']}
      popupRender={popup}
      onOpenChange={(open) => setDropdownOpen(open)}
      open={dropdownOpen}
    >
      <Badge
        count={unreadCount}
        size="small"
        offset={[0, 4]}
      >
        <Button
          shape="circle"
          type="text"
        >
          <HugeiconsIcon icon={Notification01Icon} size={24} />
        </Button>
      </Badge>
    </Dropdown>
  );
}

export default NotificationsDropdown;
