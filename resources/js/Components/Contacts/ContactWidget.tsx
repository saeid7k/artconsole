import { ContactProps } from '@/types/contact';
import { LinkSquare02Icon, Unlink02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button, Tooltip } from 'antd';
import ContactAvatar from './ContactAvatar';

type Props = {
  contact: ContactProps;
  title?: string;
  viewButton?: boolean;
  unsetFunction?: () => void;
  className?: string;
}

function ContactWidget({ contact, title = 'Contact', viewButton = true, unsetFunction, className }: Props) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <div className="flex items-center gap-1 border border-dashed border-soft rounded py-1 px-2 w-max h-max">
        <ContactAvatar contact={contact} />
        <div className="flex flex-col leading-tight">
          <label>{title}</label>
          <div>{contact?.full_name}</div>
        </div>
      </div>
      <div className="flex flex-col">
        {viewButton && (
          <Tooltip title="View in new tab" placement="right">
            <Button
              size='small'
              variant='text'
              color='blue'
              icon={<HugeiconsIcon icon={LinkSquare02Icon} size={16} />}
              href={contact ? route('contacts.show', contact.id) : '#'}
              target="_blank"
            />
          </Tooltip>
        )}
        {typeof unsetFunction === 'function' && (
          <Tooltip title="Unset" placement="right">
            <Button
              size='small'
              variant='text'
              color='red'
              icon={<HugeiconsIcon icon={Unlink02Icon} size={16} />}
              onClick={unsetFunction}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default ContactWidget;
