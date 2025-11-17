import { AddSquareIcon, ContactIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Dropdown, Menu } from "antd";

function QuickCreateDropdown() {

  const popup = () => {
    return (
      <Menu>
        <Menu.Item key="new-contact"
          onClick={() => {router.visit(route('contacts.index'), {
            data: {
              action: 'create',
            }
          })}}
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ContactIcon} size={20} />
            New Contact
          </div>
        </Menu.Item>
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
        <HugeiconsIcon icon={AddSquareIcon} size={24} />
      </Button>
    </Dropdown>
  );
}

export default QuickCreateDropdown;
