import { ReactNode } from "react"

function DataRow({ icon, label, value }: { icon: ReactNode, label: string | ReactNode, value: string | ReactNode }) {
  return (
    <div className="flex items-center gap-0 flex-wrap">
      {icon}
      <label className="ms-1 whitespace-nowrap">{label}</label>
      <span className="ms-2">{value}</span>
    </div>
  )
}

export default DataRow
