import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  label?: string
  borderStyle?: 'dashed' | 'solid' | 'dotted';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  background?: 'light' | 'soft' | 'none';
  rootClassName?: string
  labelClassName?: string
  onClick?: () => void
  children: React.ReactNode
}>

function Container({ label, borderStyle = 'solid', rounded = 'md', background = 'none', rootClassName, labelClassName, onClick, children }: Props) {
  return (
    <div
      className={twMerge(
        'flex flex-col bg-base border rounded-lg p-2',
        `!border-${borderStyle}`,
        `rounded-${rounded}`,
        `bg-${background}`,
        rootClassName
      )}
      onClick={onClick}
    >
      {label && (
        <small className={`text-primary -translate-y-1 ${labelClassName}`}>{label}</small>
      )}
      <div>
        {children}
      </div>
    </div>
  )
}

export default Container;
