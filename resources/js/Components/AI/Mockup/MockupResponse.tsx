import Container from "@/Components/Containers/Container";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ResourceChips from "@/Components/ResourceChips";
import { useAiAssistant } from "@/contexts/AiAssistantContext";
import { AiMessage } from "@/types/aiMessage";
import { downloadFile } from "@/utils/downloadHelper";
import { router } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Image, message as messageToast } from "antd";
import axios from "axios";

function MockupResponse({ message }: { message: AiMessage }) {

  const { setAiDrawerOpen } = useAiAssistant()

  // Queries

  const mediaQuery = useQuery({
    queryKey: ['messageMedia', message.id],
    queryFn: () => axios.get(route('ai.message.media', { messageId: message.id })).then(res => res.data),
    enabled: !!message.id,
    retry: false,
  })

  const addToArtworkMutation = useMutation({
    mutationFn: () => axios.post(route('ai.message.add-media-to-artwork'), {
      message_id: message.id
    }),
    onSuccess: () => {
      messageToast.success('Mockup added to artwork successfully');
      setAiDrawerOpen(false)
      router.reload()
    },
    onError: () => {
      messageToast.error('Failed to add mockup to artwork');
    }
  })

  // Derived State

  const mediaUrl = mediaQuery.data?.urls?.original || ''

  // Render

  if (mediaQuery.isLoading) {
    return (
      <LoadingSpinner size="large" />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Container label="Resource" labelClassName="text-muted" rounded="lg" >
          <ResourceChips
            resource={{
              "type": "artworks",
              "id": message?.artwork?.id || 0,
              "name": message?.artwork?.title || 'Unknown Artwork',
              "image": message?.artwork?.main_image_thumb_url || '',
            }}
            closable={false}
            onClick={() => {
              router.get(route('artworks.show', message?.artwork?.id))
              setAiDrawerOpen(false)
            }}
          />
      </Container>
      <Card
        title="Generated Mockup"
        actions={[
          <Button
            type="text"
            onClick={() => downloadFile({ url: mediaUrl, fileName: mediaQuery.data.file_name })}
            disabled={!mediaUrl}
          >
            Download
          </Button>,
          <Button
            type="text"
            onClick={() => addToArtworkMutation.mutate()}
            disabled={!mediaUrl}
            loading={addToArtworkMutation.isPending}
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
    </div>
  )
}

export default MockupResponse
