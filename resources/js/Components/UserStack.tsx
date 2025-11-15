import { UserProps } from "@/types/user";
import { getInitials } from "@/utils/stringHelper";
import { Avatar } from "antd";

type Props = {
  user: UserProps;
};

function UserStack({ user }: Props): JSX.Element {
  return (
    <div className='flex items-center gap-1'>
      <Avatar size={'small'} className='text-xs' src={user.photo}>{getInitials(user.full_name)}</Avatar>
      <div>{user.full_name}</div>
    </div>
  )
}

export default UserStack;
