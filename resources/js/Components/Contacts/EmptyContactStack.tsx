import { UsePageProps } from "@/types/usePage";
import { router, usePage } from "@inertiajs/react";
import { Button, Empty } from "antd";
import FlexBox from "../Containers/FlexBox";

function EmptyContactStack() {

  const user = usePage<UsePageProps>().props.auth.user;

  return (
    <FlexBox direction="col" >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={user?.has_edit_access ? null : 'No contacts found'}
        rootClassName="m-1"
      />
      {user?.has_edit_access && (
        <Button
          onClick={() => {
            router.visit(route('contacts.index'), {
              data: {
                action: 'create',
              }
            })
          }}
        >
          Add a Contact
        </Button>
      )}
    </FlexBox>
  )
}

export default EmptyContactStack;
