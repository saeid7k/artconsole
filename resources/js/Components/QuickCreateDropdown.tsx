import { AddSquareIcon, ContactIcon, ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Dropdown, Menu } from "antd";
import FlexBox from "./Containers/FlexBox";

function QuickCreateDropdown() {

  const popup = () => {
    return (
      <Menu>
        <Menu.Item key="new-artwork"
          onClick={() => {router.visit(route('artworks.index'), {
            data: {
              action: 'create',
            }
          })}}
        >
          <FlexBox gap={2} >
            <HugeiconsIcon icon={ImageAdd02Icon} size={20} />
            New Artwork
          </FlexBox>
        </Menu.Item>
        <Menu.Item key="new-contact"
          onClick={() => {router.visit(route('contacts.index'), {
            data: {
              action: 'create',
            }
          })}}
        >
          <FlexBox gap={2} >
            <HugeiconsIcon icon={ContactIcon} size={20} />
            New Contact
          </FlexBox>
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
