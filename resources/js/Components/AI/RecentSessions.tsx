import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import StyledDate from "../StyledDate"
import { getAgentTitleByClass } from "@/constants/Ai/aiMenuItems"
import { Button } from "antd"
import { useState } from "react"
import LoadingSpinner from "../LoadingSpinner"

function RecentSessions() {

  const [items, setItems] = useState<any[]>([])
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null)

  const sessionsQuery = useQuery({
    queryKey: ['recentSessions'],
    queryFn: () => axios.post(route('ai.recent-sessions')).then(res => {
      setNextPageUrl(res.data.next_page_url || null)
      setItems(res.data.data)
      return res.data
    }),
  })

  const loadMoreQuery = useQuery({
    queryKey: ['loadMore', nextPageUrl],
    queryFn: () => axios.post(nextPageUrl!).then(res => {
      setNextPageUrl(res.data.next_page_url || null)
      setItems(prev => [...prev, ...res.data.data])
      return res.data
    }),
    enabled: false,
  })

  if (sessionsQuery.isFetching || sessionsQuery.isLoading) {
    return <LoadingSpinner size="large" />
  }

  return (
    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
      {items.map((session: any) => (
        <div
          key={session.id}
          className="flex justify-between items-center border px-2 py-1 rounded-lg hover:bg-gray-500/5 hover:cursor-pointer transition"
        >
          <div>{ getAgentTitleByClass(session.agent) }</div>
          <div><StyledDate value={session.created_at} showIcon={false} /></div>
        </div>
      ))}
      <Button
        onClick={() => loadMoreQuery.refetch()}
        loading={loadMoreQuery.isFetching}
        disabled={!nextPageUrl}
      >
        Load More
      </Button>
    </div>
  )
}

export default RecentSessions
