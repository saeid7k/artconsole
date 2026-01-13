import colors from "@/Themes/theme";
import { LocationProps } from "@/types/location";
import { ArrowDataTransferHorizontalIcon, StoreLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tag, Tooltip } from "antd";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";
import CopyToClipboard from "../CopyToClipboard";
import MoveModal from "../MoveModal";

type Props = {
  location: LocationProps;
  showActions?: boolean;
  showAddress?: boolean;
  showPrimaryTag?: boolean;
  clamped?: boolean;
  boxed?: boolean;
  bordered?: boolean;
  className?: string;
}

function LocationStack({
  location,
  showActions = true,
  showAddress = false,
  showPrimaryTag = false,
  clamped = true,
  boxed = false,
  bordered = false,
  className
}: Props) {

  const [openMoveModal, setOpenMoveModal] = useState(false);

  return(
    <>
      <FlexBox alignItems="start" >
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
              <FlexBox>
                <div
                  className={twMerge(
                    'text-muted',
                    clamped ? 'max-w-[200px] line-clamp-1' : ''
                  )}
                  title={clamped ? location.formatted_address : undefined}
                >{location.formatted_address}</div>
                <CopyToClipboard content={location.formatted_address} title="Address" />
              </FlexBox>
            )}
          </div>
        </div>
        { showPrimaryTag && location.is_primary && (
          <Tag
            variant="solid"
            color="blue"
            className="ms-1"
          >Primary</Tag>
        )}
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
      </FlexBox>
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
