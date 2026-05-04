import { Divider } from "antd"

type Props = {
  icon?: React.ReactNode,
  onClick?: () => void,
  children: React.ReactNode,
}

function ItemRow({icon, onClick, children}: Props) {
  return (
    <div
      className="flex items-center gap-1 border px-3 py-2 rounded-lg
        transition-all duration-300 cursor-pointer bg-base hover:bg-linear-45
        hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-950 dark:hover:to-blue-950"
      onClick={onClick}
    >
      {icon && (
        <>
          {icon}
          <div className="self-stretch">
            <Divider orientation="vertical" className="h-[100%]" />
          </div>
        </>
      )}
      <div>{children}</div>
    </div>
  )
}

export default ItemRow
