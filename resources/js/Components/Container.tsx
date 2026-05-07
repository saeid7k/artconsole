import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  label?: string
  className?: string
  labelClassName?: string
  children: React.ReactNode
}>

function Container({ label, className, labelClassName, children }: Props) {
  return (
    <div
      className={`mt-3 flex flex-col bg-base border border-dashed border-purple-300 rounded-lg p-2 ${className}`}
    >
      {label && <small className={`text-primary -translate-y-1 ${labelClassName}`}>{label}</small>}
      <div>
        {children}
      </div>
    </div>
  )
}

export default Container;
