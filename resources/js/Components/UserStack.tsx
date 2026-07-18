import { UserProps } from "@/types/user";
import { getInitials } from "@/utils/stringHelper";
import { Avatar, Tag } from "antd";

type Props = {
  user: UserProps;
};

function UserStack({ user }: Props) {
  return (
    <div className='flex items-center gap-1'>
      <Avatar size={'small'} className='text-xs shrink-0' src={user.photo_small}>{getInitials(user.full_name)}</Avatar>
      <div>{user.full_name}</div>
      {user?.is_demo && <Tag>Demo</Tag> }
    </div>
  )
}

export default UserStack;
