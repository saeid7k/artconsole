import { router } from "@inertiajs/react";
import { Button, Empty } from "antd";
import FlexBox from "../Containers/FlexBox";

function EmptyArtworkStack() {
  return (
    <FlexBox direction="col" >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} rootClassName="m-1" />
      <Button
        onClick={() => {
          router.visit(route('artworks.index'), {
            data: {
              action: 'create',
            }
          })
        }}
      >
        Add your first Artwork
      </Button>
    </FlexBox>
  )
}

export default EmptyArtworkStack;
