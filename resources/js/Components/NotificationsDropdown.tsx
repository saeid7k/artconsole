import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Dropdown, Menu } from "antd";

function NotificationsDropdown() {

  const popup = () => {
    return (
      <Menu className="min-w-[200px]">
        <div className="text-center p-1">Notifications</div>
        <Menu.Divider />
        {[1,2,3,4,5].map((n) => (
          <Menu.Item key={n}>notification #{n}</Menu.Item>
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
