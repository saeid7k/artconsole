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

  const gallery = usePage<UsePageProps>().props?.current_gallery
  const { setOpenUpgradeModal } = useApp()

  const isPro = gallery?.is_subscribed

  function handleClick() {
    if (onClick) {
      onClick();
    }
    setOpenUpgradeModal(true);
  }

  if (isPro) {
    return null
  }

  return (
    <Button
      size={size}
      variant="outlined"
      color="purple"
      icon={<HugeiconsIcon icon={Rocket01Icon} size={16} />}
      onClick={handleClick}
    >
      PRO
    </Button>
  )
}

export default ProBadge;
