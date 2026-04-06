import { useArtworkShow } from "@/contexts/ArtworkShowContext";
import colors from "@/Themes/theme";
import { ActivityLogProps } from "@/types/activityLog";
import { LocationProps } from "@/types/location";
import { ArrowDataTransferHorizontalIcon, ArrowRight04Icon, InformationCircleIcon, StoreLocation01Icon, TimeQuarterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, Popover, Tag, Timeline, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import DataRow from "../Containers/DataRow";
import FlexBox from "../Containers/FlexBox";
import CopyToClipboard from "../CopyToClipboard";
import LoadingSpinner from "../LoadingSpinner";
import MoveModal from "../MoveModal";
import StyledDivider from "../StyledDivider";
import { dayjsUserTz } from "@/utils/dateTimeHelper";

type Props = {
  location: LocationProps;
  showTitle?: boolean;
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
  showTitle = false,
  showActions = true,
  showAddress = false,
  showPrimaryTag = false,
  clamped = true,
  boxed = false,
  bordered = false,
  className
}: Props) {

  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const { artwork } = useArtworkShow()

  // Fetch Location Move Logs

  const logQuery = useQuery({
    queryKey: ['location-logs-', artwork?.id],
    queryFn: () => {
      return axios.get(route('activity-logs.model-activities', {
        model_type: 'artwork',
        model_id: artwork?.id,
        names: ['default', 'artwork-move']
      }))
      .then(res => res.data)
      .catch(err => {
        throw err;
      })
    },
    enabled: (artwork && openHistory) ? true : false,
    retry: false,
  })

  useEffect(() => {
    if (openHistory) {
      logQuery.refetch();
    }
  }, [location])

  const createdLog = logQuery.data?.filter((log: ActivityLogProps) => log.event === 'created' && log.log_name === 'default' && log.properties.location);
  const moveLogs = logQuery.data?.filter((log: ActivityLogProps) => log.log_name === 'artwork-move');

  return(
    <>
      <FlexBox alignItems="start" className="max-w-full">

        {/* Body */}

        <FlexBox
          direction="col"
          alignItems="start"
          className={twMerge(
            'max-w-full overflow-x-auto',
            boxed ? 'p-2 bg-light rounded' : '',
            bordered ? 'border border-solid border-light' : '',
            className
          )}
        >
          {showTitle && <label>Location</label>}
          <FlexBox alignItems="start">
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
          </FlexBox>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={openHistory ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
            className="w-full"
          >
            <StyledDivider variant="light" >Location History</StyledDivider>
            {logQuery.isSuccess && logQuery.data.length > 0 && (
              <div className="w-full overflow-x-auto">
                <Timeline
                  mode="start"
                  titleSpan={6}
                  className="min-w-[450px] pt-2 max-h-[400px] overflow-y-auto"
                >
                  {createdLog.length > 0 && (
                    createdLog.map((log: ActivityLogProps) => (
                      <Timeline.Item
                        title={dayjsUserTz(log.created_at).format('MMM D, YYYY')}
                        placement="start"
                      >
                        added to {log.properties.location}
                      </Timeline.Item>
                    ))
                  )}
                  {moveLogs.map((log: ActivityLogProps) => (
                    <Timeline.Item
                      title={dayjsUserTz(log.created_at).format('MMM D, YYYY')}
                      placement="start"
                    >
                      <FlexBox className="w-full">
                        <div className="grid grid-cols-12 gap-1 grow">
                          <div className="col-span-5">{log.properties?.prev_location}</div>
                          <HugeiconsIcon icon={ArrowRight04Icon} size={20} color={colors.gray[400]} />
                          <div className="col-span-5">{log.properties?.new_location}</div>
                        </div>
                        <Popover
                          placement="right"
                          content={
                            <>
                              <DataRow
                                label="Submitted by:"
                                value={log.causer?.full_name || 'System'}
                              />
                              <DataRow
                                label="Reason:"
                                value={
                                  <div className={log.properties?.reason ? '' : 'text-ghost'} >
                                    {log.properties?.reason || 'No reason provided.'}
                                  </div>
                                }
                              />
                            </>
                          }
                        >
                          <HugeiconsIcon icon={InformationCircleIcon} size={16} color={colors.gray[400]} />
                        </Popover>
                      </FlexBox>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
            {logQuery.isFetching && <LoadingSpinner />}
            {logQuery.isSuccess && logQuery.data.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No location history available.' />
            )}
          </motion.div>
        </FlexBox>

        {/* Primary Tag */}

        { showPrimaryTag && location.is_primary && (
          <Tag
            variant="solid"
            color="blue"
            className="ms-1"
          >
            Primary
          </Tag>
        )}

        {/* Actions */}

        {showActions && (
          <FlexBox direction="col">
            {artwork && (
              <Tooltip title="Move" placement="right">
                <Button
                  size="small"
                  variant="text"
                  icon={<HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />}
                  color="blue"
                  onClick={() => setOpenMoveModal(true)}
                />
              </Tooltip>
            )}
            <Tooltip title="History" placement="right">
              <Button
                size="small"
                variant="text"
                icon={<HugeiconsIcon icon={TimeQuarterIcon} size={16} />}
                color="default"
                onClick={() => setOpenHistory(!openHistory)}
              />
            </Tooltip>
          </FlexBox>
        )}
      </FlexBox>
      {showActions && artwork && (
        <MoveModal
          open={openMoveModal}
          setOpen={setOpenMoveModal}
          artwork={artwork}
        />
      )}
    </>
  )
}

export default LocationStack;
