import ResourceChips from "@/Components/ResourceChips";
import { useAiAssistant } from "@/contexts/AiAssistantContext";
import { AiMessage } from "@/types/aiMessage";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Divider, Empty, message as messageToast } from "antd";
import axios from "axios";

function DescriptionResponse({ message }: { message: AiMessage }) {

  const { setAiDrawerOpen } = useAiAssistant()

  const addToArtworkMutation = useMutation({
    mutationFn: () => axios.post(route('ai.message.add-description-to-artwork'), {
      message_id: message.id
    }),
    onSuccess: () => {
      messageToast.success('Description added to artwork successfully');
      setAiDrawerOpen(false)
      router.reload()
    },
    onError: () => {
      messageToast.error('Failed to add description to artwork');
    }
  })

  return (
    <Card
      title="Generated Description"
      actions={[
        <Button
          type="text"
          onClick={
            () => navigator.clipboard.writeText(message?.content || '')
              .then(() => {messageToast.success('Description copied to clipboard')})
              .catch(() => {messageToast.error('Failed to copy description')})
          }
          disabled={!message?.content}
        >
          Copy to Clipboard
        </Button>,
        <Button
          type="text"
          onClick={() => addToArtworkMutation.mutate()}
          disabled={!message?.content}
          loading={addToArtworkMutation.isPending}
        >
          Add to Artwork
        </Button>
      ]}
    >
      <div>
        <div>Resource</div>
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
      </div>
      <Divider />
      <div
        className="flex max-h-[400px] overflow-y-auto w-full max-w-full"
      >
        {message?.content && (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
        {!message?.content && (
          <Empty description="No description available" />
        )}
      </div>
    </Card>
  )
}

export default DescriptionResponse
