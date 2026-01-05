import colors from "@/Themes/theme";
import { LocationProps } from "@/types/location";
import { ArrowDataTransferHorizontalIcon, StoreLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tooltip } from "antd";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import MoveModal from "./MoveModal";

type Props = {
  location: LocationProps;
  showActions?: boolean;
  showAddress?: boolean;
  clamped?: boolean;
  boxed?: boolean;
  bordered?: boolean;
  className?: string;
}

function LocationStack({ location, showActions = true, showAddress = false, clamped = true, boxed = false, bordered = false, className }: Props) {

  const [openMoveModal, setOpenMoveModal] = useState(false);

  return(
    <>
      <div className="flex gap-1">
        <div
          className={twMerge(
            "flex items-start gap-1",
            boxed ? 'p-2 bg-light rounded' : '',
            bordered ? 'border border-solid border-light' : '',
            className
          )}
        >
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
        {showActions && (
          <div className="flex flex-col">
            <Tooltip title="Move" placement="right">
              <Button
                size="small"
                variant="text"
                icon={<HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />}
                color="blue"
                onClick={() => setOpenMoveModal(true)}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {showActions && (
        <MoveModal
          open={openMoveModal}
          setOpen={setOpenMoveModal}
        />
      )}
    </>
  )
}

export default LocationStack;
