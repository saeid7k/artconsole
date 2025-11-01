import { Delete01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: 'edit' | 'delete'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

function CornerAction({ variant = 'edit', size = 'md', placement = 'top-right', className, ...props }: Props) {

  const iconComponent = () => {
    switch (variant) {
      case 'edit':
        return PencilEdit02Icon
      case 'delete':
        return Delete01Icon
      default:
        return PencilEdit02Icon
    }
  }

  const iconSize = () => {
    switch (size) {
      case 'xs':
        return 12
      case 'sm':
        return 14
      case 'md':
        return 16
      case 'lg':
        return 20
      case 'xl':
        return 24
      default:
        return 16
    }
  }

  const placementClasses = () => {
    switch (placement) {
      case 'top-right':
        return 'top-0 right-0';
      case 'top-left':
        return 'top-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      default:
        return 'top-0 right-0';
    }
  }

  const spacingClasses = () => {
    switch (size) {
      case 'xs':
        return 'p-0.5';
      case 'sm':
      case 'md':
        return 'p-1';
      case 'lg':
      case 'xl':
        return 'p-2';
      default:
        return 'p-1';
    }
  }

  const roundedClasses = () => {
    switch (placement) {
      case 'top-right':
        return 'rounded-bl-lg';
      case 'top-left':
        return 'rounded-br-lg';
      case 'bottom-right':
        return 'rounded-tl-lg';
      case 'bottom-left':
        return 'rounded-tr-lg';
      default:
        return 'rounded-bl-lg';
    }
  }

  const colorClasses = 'bg-gray-500/10 hover:bg-primary-100 dark:hover:bg-primary-800 text-muted hover:text-inherit transition-colors'

  return (
    <div
      className={`absolute ${placementClasses()} ${colorClasses} ${spacingClasses()} ${roundedClasses()} cursor-pointer w-min h-min leading-none ${className ?? ''}`}
      {...props}
    >
      <HugeiconsIcon icon={iconComponent()} size={iconSize()} />
    </div>
  )
}

export default CornerAction;
