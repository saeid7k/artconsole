import { UsePageProps } from "@/types/usePage";
import { router, usePage } from "@inertiajs/react";
import { Button, Empty } from "antd";
import FlexBox from "../Containers/FlexBox";

function EmptyArtworkStack() {

  const user = usePage<UsePageProps>().props.auth.user;

  return (
    <FlexBox direction="col" >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={user?.has_edit_access ? null : 'No artworks found'}
        rootClassName="m-1"
      />
      {user?.has_edit_access && (
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
      )}
    </FlexBox>
  )
}

export default EmptyArtworkStack;
