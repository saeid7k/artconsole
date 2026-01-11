import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  icon?: ReactNode | null
  label?: string | ReactNode | null
  value: string | ReactNode
  wrapping?: boolean
  align?: 'center' | 'start' | 'end'
  labelClassName?: string
  rootClassName?: string
}

function DataRow({ icon = null, label = null, value, wrapping = true, align = 'center', labelClassName = '', rootClassName = '' }: Props) {
  return (
    <div className={twMerge(
        'flex items-center gap-0',
        wrapping ? 'flex-wrap' : 'flex-nowrap',
        `items-${align}`,
        rootClassName
      )}>
      {icon}
      {label && (
        <label className={`ms-1 whitespace-nowrap ${labelClassName}`}>{label}</label>
      )}
      <span className="ms-2">{value}</span>
    </div>
  )
}

export default DataRow
