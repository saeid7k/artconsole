import { ContactProps } from '@/types/contact';
import { LinkSquare02Icon, Unlink02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button, Tooltip } from 'antd';

type Props = {
  artist?: ContactProps;
  viewButton?: boolean;
  clearFunction?: () => void;
  className?: string;
}

function ArtistStack({ artist, viewButton = true, clearFunction, className }: Props) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <div className="border border-dashed border-soft rounded py-1 px-2 w-max">
        <div className="flex flex-col">
          <label className=''>Artist</label>
          <div>{artist?.full_name}</div>
        </div>
      </div>
      <div className="flex flex-col">
        {viewButton && (
          <Tooltip title="View Artist" placement="right">
            <Button
              size='small'
              variant='text'
              color='blue'
              icon={<HugeiconsIcon icon={LinkSquare02Icon} size={16} />}
              href={artist ? route('contacts.show', artist.id) : '#'}
              target="_blank"
            />
          </Tooltip>
        )}
        {typeof clearFunction === 'function' && (
          <Tooltip title="Clear Artist" placement="right">
            <Button
              size='small'
              variant='text'
              color='red'
              icon={<HugeiconsIcon icon={Unlink02Icon} size={16} />}
              onClick={clearFunction}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default ArtistStack;
