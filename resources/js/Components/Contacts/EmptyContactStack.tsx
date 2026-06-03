import { router } from "@inertiajs/react";
import { Button, Empty } from "antd";
import FlexBox from "../Containers/FlexBox";

function EmptyContactStack() {
  return (
    <FlexBox direction="col" >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} rootClassName="m-1" />
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
    </FlexBox>
  )
}

export default EmptyContactStack;
