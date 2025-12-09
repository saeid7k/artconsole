import colors from "@/Themes/theme";
import { StoreLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { twMerge } from "tailwind-merge";

type Props = {
  name: string;
  address: string;
  showAddress?: boolean;
  clamped?: boolean;
}

function LocationStack({ name, address, showAddress = false, clamped = true }: Props) {
  return(
    <div className="flex items-center gap-1">
      <HugeiconsIcon icon={StoreLocation01Icon} color={colors.gray[400]} />
      <div className="flex flex-col">
        <div>{name}</div>
        { showAddress && (
          <div
            className={twMerge(
              'text-muted',
              clamped ? 'max-w-[200px] line-clamp-1' : ''
            )}
            title={clamped ? address : undefined}
          >{address}</div>
        )}
      </div>
    </div>
  )
}

export default LocationStack;
