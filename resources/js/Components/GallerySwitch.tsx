import { APP_LOGO } from "@/constants/appConstants";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Button } from "antd";

function GallerySwitch() {

  const { gallery }: any = usePage().props
  const logo = gallery?.logo ?? APP_LOGO

  return (
    <Button
      className="flex items-center gap-2 px-1 group"
      variant="text"
      color="default"
    >
      <img src={logo} alt="Logo" className="max-h-[24px] max-w-[24px] p-1 shadow rounded" />
      <div
        className="font-semibold"
      >
        {gallery.name}
      </div>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={16}
        className="opacity-0 group-hover:opacity-100 duration-500"
      />
    </Button>
  );
}

export default GallerySwitch
