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

  const user = usePage().props.auth.user

  const defaultTitle = `${user.firstname}'s Gallery`

  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="w-8 h-8 mb-1" />
      <div className="text-xl font-semibold text-center">{title ?? defaultTitle}</div>
    </div>
  )
}

export default LogoBox;
