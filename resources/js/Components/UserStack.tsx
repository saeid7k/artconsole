import { UserProps } from "@/types/user";
import { getInitials } from "@/utils/stringHelper";
import { Avatar, Tag } from "antd";

type Props = {
  user: UserProps;
};

function UserStack({ user }: Props) {

  const renderDeletingTag = () => {
    if (
      typeof user?.days_to_delete == 'undefined'
      || user?.days_to_delete == null
    ) {
      return null;
    }

    if (user.days_to_delete == 0) {
      return <Tag color='red'>Will be deleted soon</Tag>
    } else if (user.days_to_delete == 1) {
      return <Tag color='red'>Delete in 1 day</Tag>
    } else {
      return <Tag color='red'>Delete in {user.days_to_delete} days</Tag>
    }
  }

  return (
    <div className='flex items-center gap-1'>
      <Avatar size={'small'} className='text-xs shrink-0' src={user.photo_small}>{getInitials(user.full_name)}</Avatar>
      <div
        className='leading-none me-1'
      >{user.full_name}</div>
      {user?.is_demo && <Tag color='blue'>Demo</Tag> }
      {renderDeletingTag()}
    </div>
  )
}

export default UserStack;
