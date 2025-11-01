import { ActivityLogProps } from "@/types/activityLog";
import { Time04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, Empty, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/Components/LoadingSpinner";

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

  return (
    <div className="flex flex-col gap-2">
      {logs.map(log => (
        <div
          key={log.id}
          className="flex items-center justify-between gap-2 px-2 py-1 bg-light border border-solid border-light rounded"
        >
          <div className="flex items-center gap-1">
            <Avatar
              size={24}
              src={log.causer?.photo}
            />
            <div className="text-muted">{log.causer?.firstname}</div>
            <div>{log.description}</div>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Time04Icon} size={16} className="text-muted" />
            {moment(log.created_at).format('MMM D, YYYY h:mm A')}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityLogs;
