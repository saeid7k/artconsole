import { ReactNode } from "react"

type Props = {
  icon: ReactNode
  label: string | ReactNode
  value: string | ReactNode
  labelClassName?: string
}

function DataRow({ icon, label, value, labelClassName = '' }: Props) {
  return (
    <div className="flex items-center gap-0 flex-wrap">
      {icon}
      <label className={`ms-1 whitespace-nowrap ${labelClassName}`}>{label}</label>
      <span className="ms-2">{value}</span>
    </div>
  )
}

export default DataRow
