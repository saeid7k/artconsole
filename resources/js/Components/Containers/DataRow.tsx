import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import CopyToClipboard from "../CopyToClipboard"

type Props = {
  icon?: ReactNode | null
  label?: string | ReactNode | null
  value: string | ReactNode | null
  wrapping?: boolean
  align?: 'center' | 'start' | 'end'
  showCopyToClipboard?: boolean
  hideIfNoValue?: boolean
  labelClassName?: string
  rootClassName?: string
}

function DataRow({
  icon = null,
  label = null,
  value = null,
  wrapping = true,
  align = 'center',
  showCopyToClipboard = false,
  hideIfNoValue = false,
  labelClassName = '',
  rootClassName = ''
}: Props) {

  const isCopyToClipboardAvailable = showCopyToClipboard && typeof value === 'string' && value.length > 0

  if (hideIfNoValue && (
    !value
    || (typeof value === 'string' && value.trim().length === 0)
  )) {
    return null
  }

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
      <span
        className={twMerge("ms-2",
          !value ? 'text-muted font-light' : '',
        )}
      >
        {value || 'N/A'}
      </span>
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
