import { APP_LOGO } from "@/constants/appConstants"
import { usePage } from "@inertiajs/react"

type Props = {
  logo?: string
  title?: string|null
}

function LogoBox({
  logo = APP_LOGO,
  title = null
}: Props) {

  const { gallery }: any = usePage().props

  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="w-10 h-10 p-1 mb-1 shadow rounded" />
      <div className="text-xl font-semibold text-center">{title ?? gallery?.name}</div>
    </div>
  )
}

export default LogoBox;
