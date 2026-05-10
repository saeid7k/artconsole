import { Divider } from "antd"
import { twMerge } from "tailwind-merge"

type Props = {
  icon?: React.ReactNode,
  size?: 'sm' | 'md' | 'lg',
  gradientBackground?: boolean,
  onClick?: () => void,
  children: React.ReactNode,
}

function ItemRow({icon, size = 'md', gradientBackground = false, onClick, children}: Props) {

  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
  }

  return (
    <div
      className={twMerge(
        "flex items-center gap-1 border rounded-lg transition-all duration-300 bg-base min-w-max",
        sizeClasses[size],
        gradientBackground && 'hover:bg-linear-45 hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-950 dark:hover:to-blue-950',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      {icon && (
        <>
          <div>{icon}</div>
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
