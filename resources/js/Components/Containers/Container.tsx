import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  label?: string
  bordered?: boolean
  borderStyle?: 'dashed' | 'solid' | 'dotted';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  background?: 'light' | 'soft' | 'none';
  rootClassName?: string
  labelClassName?: string
  contentClassName?: string
  onClick?: () => void
  children: React.ReactNode
}>

function Container({
  label,
  bordered = true,
  borderStyle = 'solid',
  rounded = 'md',
  background = 'none',
  rootClassName,
  labelClassName,
  contentClassName,
  onClick,
  children
}: Props) {
  return (
    <div
      className={twMerge(
        'flex flex-col bg-base rounded-lg p-2',
        bordered ? `border !border-${borderStyle}` : '',
        `rounded-${rounded}`,
        `bg-${background}`,
        rootClassName
      )}
      onClick={onClick}
    >
      {label && (
        <small className={`text-primary -translate-y-1 ${labelClassName}`}>{label}</small>
      )}
      <div className={twMerge(contentClassName)}>
        {children}
      </div>
    </div>
  )
}

export default Container;
