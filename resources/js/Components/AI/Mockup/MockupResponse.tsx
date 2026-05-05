import LoadingSpinner from "@/Components/LoadingSpinner";
import { AiMessage } from "@/types/aiMessage";
import { downloadFile } from "@/utils/downloadHelper";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Image } from "antd";
import axios from "axios";

function MockupResponse({ message }: { message: AiMessage }) {

  const mediaQuery = useQuery({
    queryKey: ['messageMedia', message.id],
    queryFn: () => axios.get(route('ai.message.media', { messageId: message.id })).then(res => res.data),
    enabled: !!message.id,
    retry: false,
  })

  const mediaUrl = mediaQuery.data?.urls?.original || ''

  if (mediaQuery.isLoading) {
    return (
      <LoadingSpinner size="large" />
    )
  }

  return (
    <Card
      actions={[
        <Button
          type="text"
          onClick={() => downloadFile({url: mediaUrl, fileName: mediaQuery.data.file_name})}
          disabled={!mediaUrl}
        >
          Download
        </Button>,
        <Button
          type="text"
          disabled={!mediaUrl}
        >
          Add to Artwork
        </Button>
      ]}
    >
      <div
        className="flex justify-center items-center max-h-[400px] w-auto max-w-100"
      >
        {mediaUrl && (
          <Image
            src={mediaQuery.data?.urls?.original || ''}
            alt="Generated Mockup"
            className="max-h-100 aspect-auto rounded-lg shadow"
          />
        )}
        {mediaQuery.isError && (
          <Empty description="Failed to load mockup image" />
        )}
      </div>
    </Card>
  )
}

export default MockupResponse
