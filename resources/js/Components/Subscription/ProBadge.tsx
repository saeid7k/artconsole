import { useApp } from "@/contexts/AppContext";
import { UsePageProps } from "@/types/usePage";
import { Rocket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Button } from "antd";

type Props = {
  size?: 'small' | 'middle' | 'medium' | 'large';
  onClick?: () => void;
}

function ProBadge({ size = 'small', onClick }: Props) {

  const { auth: { user }, current_gallery: gallery } = usePage<UsePageProps>().props

  const { setOpenUpgradeModal } = useApp()

  const isPro = gallery?.is_subscribed
  const isDemo = user?.is_demo

  function handleClick() {
    if (onClick) {
      onClick();
    }
    setOpenUpgradeModal(true);
  }

  if (isPro || user?.is_admin) {
    return null
  }

  return (
    <Button
      size={size}
      variant="outlined"
      color="purple"
      icon={<HugeiconsIcon icon={Rocket01Icon} size={16} />}
      onClick={handleClick}
      disabled={isDemo}
    >
      PRO
    </Button>
  )
}

export default ProBadge;
