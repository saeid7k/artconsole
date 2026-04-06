import colors from "@/Themes/theme";
import { ActivityLogProps } from "@/types/activityLog";
import { UsePageProps } from "@/types/usePage";
import { dayjsUserTz } from "@/utils/dateTimeHelper";
import { formatByKey } from "@/utils/formatHelper";
import { getInitials, isHtmlString, keyToTitle } from "@/utils/stringHelper";
import { ArrowDown01Icon, ArrowRight04Icon, Time04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { Avatar, Button, Tooltip } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import FlexBox from "./Containers/FlexBox";

function LogStack({ log }: { log: ActivityLogProps }) {

  const galleryMeta = usePage<UsePageProps>().props.current_gallery?.meta || {};
  const [showProperties, setShowProperties] = useState<boolean>(false);

  const causerName = (causer: ActivityLogProps['causer']) => {
    if (!causer) return 'System';
    return causer.firstname;
  };

  const renderTriggerIcon = () => (
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      size={16}
      className={twMerge(
        'transition-transform duration-300',
        showProperties ? '-rotate-180' : 'rotate-0'
      )}
    />
  )

  const isDetailsVisible = (
    log.log_name == 'artwork-move'
    || log.event == 'updated'
  )

  const renderMoveDetails = () => {
    return (
      <>
        {(log.properties?.prev_location || log.properties?.new_location) && (
          <FlexBox>
            <div>{log.properties?.prev_location}</div>
            <HugeiconsIcon icon={ArrowRight04Icon} size={20} />
            <div>{log.properties?.new_location}</div>
          </FlexBox>
        )}
        {log.properties?.reason && (
          <div><label>Reason: </label>{log.properties.reason}</div>
        )}
      </>
    )
  }

  const renderUpdatedDetails = () => {
    return (
      <>
        {Object.entries(log.properties?.attributes || {}).map(([key, value]) => (
          <FlexBox key={key} gap={2} alignItems="start">
            <label>{keyToTitle(key)}:</label>
            <div
              className="line-clamp-2 truncate whitespace-normal !max-w-[400px]"
            >

              {isHtmlString(String(value)) ?
                <div dangerouslySetInnerHTML={{ __html: String(value) }} />
                :
                formatByKey(key, value, galleryMeta)
              }
            </div>
          </FlexBox>
        ))}
      </>
    )
  }

  return (
    <div
      key={log.id}
      className="flex items-center justify-between flex-wrap gap-2 px-2 py-1 bg-light border border-solid border-light rounded min-w-[500px]"
    >
      <FlexBox direction="col" gap={0} alignItems="start">
        <FlexBox>
          <Avatar
            size={24}
            src={log.causer?.photo}
          >
            {getInitials(causerName(log.causer))}
          </Avatar>
          <div className="text-muted">{causerName(log.causer)}</div>
          <div>{log.description}</div>
          {isDetailsVisible && (
            <Tooltip title={showProperties ? "Hide Details" : "View Details"} mouseEnterDelay={0.5} >
              <Button
                size="small"
                type="text"
                shape="circle"
                icon={renderTriggerIcon()}
                onClick={() => setShowProperties(!showProperties)}
              />
            </Tooltip>
          )}
        </FlexBox>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={showProperties ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <FlexBox
            direction="col"
            alignItems="start"
            gap={0}
            className="ps-3 mt-2 pt-1"
            style={{ borderTop: `1px dashed ${colors.gray[300]}` }}
          >
            {log.log_name == 'artwork-move' && renderMoveDetails()}
            {log.event == 'updated' && renderUpdatedDetails()}
          </FlexBox>
        </motion.div>
      </FlexBox>
      <FlexBox className="w-max whitespace-nowrap">
        <HugeiconsIcon icon={Time04Icon} size={16} className="text-muted" />
        {dayjsUserTz(log.created_at).format('MMM D, YYYY h:mm A')}
      </FlexBox>
    </div>
  )
}

export default LogStack;
