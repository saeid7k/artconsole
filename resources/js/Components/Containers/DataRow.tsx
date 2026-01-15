import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import CopyToClipboard from "../CopyToClipboard"

type Props = {
  icon?: ReactNode | null
  label?: string | ReactNode | null
  value: string | ReactNode
  wrapping?: boolean
  align?: 'center' | 'start' | 'end'
  showCopyToClipboard?: boolean
  labelClassName?: string
  rootClassName?: string
}

function DataRow({
  icon = null,
  label = null,
  value,
  wrapping = true,
  align = 'center',
  showCopyToClipboard = false,
  labelClassName = '',
  rootClassName = ''
}: Props) {

  const isCopyToClipboardAvailable = showCopyToClipboard && typeof value === 'string' && value.length > 0

  return (
    <div className={twMerge(
        'flex gap-0',
        wrapping ? 'flex-wrap' : 'flex-nowrap',
        `items-${align}`,
        rootClassName
      )}>
      {icon}
      {label && (
        <label className={`ms-1 whitespace-nowrap ${labelClassName}`}>{label}</label>
      )}
      <span className="ms-2">{value}</span>
      {isCopyToClipboardAvailable && (
        <CopyToClipboard
          title={typeof label === 'string' ? label : null}
          content={value}
          size="md"
          className="ms-1 shrink-0"
        />
      )}
    </div>
  )
}

export default DataRow
