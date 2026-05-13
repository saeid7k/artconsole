import { getAgentIdByClass } from "@/constants/Ai/aiMenuItems"
import { AiMessage } from "@/types/aiMessage"
import { ucFirst } from "@/utils/stringHelper"
import { useQuery } from "@tanstack/react-query"
import { Button, Divider, Empty } from "antd"
import axios from "axios"
import { useState } from "react"
import AnimatedContainer from "../AnimatedContainer"
import FlexBox from "../Containers/FlexBox"
import LoadingSpinner from "../LoadingSpinner"
import StyledDate from "../StyledDate"
import MockupResponse from "./Mockup/MockupResponse"
import DescriptionResponse from "./Description/DescriptionResponse"

function RecentSessions() {

  const [items, setItems] = useState<AiMessage[]>([])
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<AiMessage | null>(null)

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
    <div
      className="mt-3"
    >
      {!selectedSession && items?.length > 0 && (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {items.map((session: AiMessage) => (
            <div
              key={session.id}
              className="flex justify-between items-center gap-3 border px-2 py-1 rounded-lg hover:bg-gray-500/5 hover:cursor-pointer transition"
              onClick={() => setSelectedSession(session)}
            >
              <FlexBox>
                <div className="whitespace-nowrap">{ ucFirst(getAgentIdByClass(session.agent).replaceAll('_', ' ')) }</div>
                <div><Divider orientation="vertical" /></div>
                {session.artwork && <div className="text-muted line-clamp-1">{session.artwork.title}</div>}
              </FlexBox>
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
      )}

      {!selectedSession && items?.length === 0 && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No sessions found" className="mt-5" />
      )}

      <AnimatedContainer condition={!!selectedSession} type="slideLeft" >
        {getAgentIdByClass(selectedSession?.agent ?? '') === 'mockup' && (
          <MockupResponse message={selectedSession!} />
        )}
        {getAgentIdByClass(selectedSession?.agent ?? '') === 'artwork_description' && (
          <DescriptionResponse message={selectedSession!} />
        )}
      </AnimatedContainer>
    </div>
  )
}

export default RecentSessions
