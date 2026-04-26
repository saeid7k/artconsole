import { GalleryProps } from "@/types/gallery";
import { UsePageProps } from "@/types/usePage";
import { getInitials } from "@/utils/stringHelper";
import { usePage } from "@inertiajs/react";
import { Avatar } from "antd";
import DemoMembersAvatar from "./Demo/DemoMembersAvatar";

function MembersAvatar({gallery}: {gallery: GalleryProps}) {

  const user = usePage<UsePageProps>().props.auth?.user;

  return (
    <>
      {user?.is_demo ?
        <DemoMembersAvatar />
        :
        <Avatar.Group max={{ count: 5 }} size="default">
          {gallery?.members?.length > 1 && gallery?.members?.map((member) => {
            return (
              <Avatar
                src={member?.photo}
              >
                {getInitials(member?.full_name)}
              </Avatar>
            )
          })}
        </Avatar.Group>
      }
    </>
  )
}

export default MembersAvatar
