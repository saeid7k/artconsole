import LoadingSpinner from "@/Components/LoadingSpinner";
import { ActivityLogProps } from "@/types/activityLog";
import { getInitials } from "@/utils/stringHelper";
import { Time04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, Empty } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

function ActivityLogs({ modelType, modelId }: { modelType: string; modelId: number }) {

  const [logs, setLogs] = useState<Array<ActivityLogProps>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function fetchActivityLogs() {
    setLoading(true);
    axios.get(route('activity-logs.model-activities', { model_type: modelType, model_id: modelId }))
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.error("Error fetching activity logs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchActivityLogs();
  }, [modelType, modelId]);

  if (loading) {
    return (<LoadingSpinner size="large" />);
  }

  if (logs.length === 0) {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activity logs found" />
    );
  }

  const causerName = (causer: ActivityLogProps['causer']) => {
    if (!causer) return 'System';
    return causer.firstname;
  }

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {logs.map(log => (
        <div
          key={log.id}
          className="flex items-center justify-between gap-2 px-2 py-1 bg-light border border-solid border-light rounded min-w-[500px]"
        >
          <div className="flex items-center gap-1">
            <Avatar
              size={24}
              src={log.causer?.photo}
            >
              {getInitials(causerName(log.causer))}
            </Avatar>
            <div className="text-muted">{causerName(log.causer)}</div>
            <div>{log.description}</div>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Time04Icon} size={16} className="text-muted" />
            {dayjs(log.created_at).format('MMM D, YYYY h:mm A')}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityLogs;
