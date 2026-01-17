import LoadingSpinner from "@/Components/LoadingSpinner";
import { ActivityLogProps } from "@/types/activityLog";
import { Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import LogStack from "./LogStack";


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
    <div className="flex flex-col gap-2 overflow-x-auto">
      {logs.map(log => <LogStack key={log.id} log={log} />)}
    </div>
  );
}

export default ActivityLogs;
