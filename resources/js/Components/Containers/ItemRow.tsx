import { Divider } from "antd"
import { twMerge } from "tailwind-merge"

type Props = {
  icon?: React.ReactNode,
  gradientBackground?: boolean,
  onClick?: () => void,
  children: React.ReactNode,
}

function ItemRow({icon, gradientBackground = false, onClick, children}: Props) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-1 border px-3 py-2 rounded-lg transition-all duration-300 bg-base",
        gradientBackground && 'hover:bg-linear-45 hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-950 dark:hover:to-blue-950',
        onClick && 'cursor-pointer',
      )}
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
      <div className="grow" >{children}</div>
    </div>
  )
}

export default ItemRow
