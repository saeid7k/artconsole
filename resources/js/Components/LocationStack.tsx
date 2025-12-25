import colors from "@/Themes/theme";
import { LocationProps } from "@/types/location";
import { StoreLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { twMerge } from "tailwind-merge";

type Props = {
  location: LocationProps;
  showAddress?: boolean;
  clamped?: boolean;
  className?: string;
}

function LocationStack({ location, showAddress = false, clamped = true, className }: Props) {
  return(
    <div className={twMerge("flex items-start gap-1", className)}>
      <HugeiconsIcon icon={StoreLocation01Icon} color={colors.gray[400]} className="pt-0.5" />
      <div className="flex flex-col">
        <div>{location.name}</div>
        { showAddress && (
          <div
            className={twMerge(
              'text-muted',
              clamped ? 'max-w-[200px] line-clamp-1' : ''
            )}
            title={clamped ? location.formatted_address : undefined}
          >{location.formatted_address}</div>
        )}
      </div>
    </div>
  )
}

export default LocationStack;
