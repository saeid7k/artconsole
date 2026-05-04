import AnimatedContainer from "@/Components/AnimatedContainer"
import FlexBox from "@/Components/Containers/FlexBox"
import NumberedSection from "@/Components/Containers/NumberedSection"
import ImageGroupFlex from "@/Components/ImageGroupFlex"
import LoadingAi from "@/Components/Loaders/LoadingAi"
import LoadingSpinner from "@/Components/LoadingSpinner"
import { MOCKUP_ENVIRONMENTS } from "@/constants/Ai/mockupEnvironments"
import { useAiAssistant } from "@/contexts/AiAssistantContext"
import { AiResource } from "@/types/aiResource"
import { downloadFile } from "@/utils/downloadHelper"
import { AiMagicIcon, DashboardSquareAddIcon, Download01Icon, HandPointingDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button, Empty, Image, message, Radio } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"

function Mockup() {

  // Context and hooks

  const { resources } = useAiAssistant()

  // State

  const isInitialRender = useRef(true)
  const [medias, setMedias] = useState<any[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [result, setResult] = useState<{ status: 'pending' | 'success' | 'error' | null, url: string | null, fileName: string | null }>({
    status: null,
    url: null,
    fileName: null,
  })

  const artworkIds = resources.filter((resource: AiResource) => resource.type === 'artworks').map((resource: AiResource) => resource.id)

  // Resource Management

  const mediaQuery = useQuery({
    queryKey: ['artworksImages', artworkIds],
    queryFn: () => axios.post(route('artworks.get-images-by-ids'), { artwork_ids: artworkIds }).then(res => {
      setMedias(res.data)
      return res.data
    }),
    enabled: artworkIds.length > 0,
  })

  function handleImageClick(index: number) {
    setSelectedImageIndex(index === selectedImageIndex ? null : index)
  }

  useEffect(() => {
    if (artworkIds.length === 0) {
      setMedias([])
      setSelectedImageIndex(null)
      return;
    }
    if (isInitialRender.current) {
      isInitialRender.current = false
      return;
    }
    mediaQuery.refetch()
  }, [resources])

  // Mockup Generation

  const generateMutation = useMutation({
    mutationKey: ['generateMockup', selectedImageIndex, selectedEnvironment],
    mutationFn: () => axios.post(route('ai.mockup.generate'), {
      media_id: medias[selectedImageIndex!].id,
      environment: selectedEnvironment,
    }),
    onSuccess: (res: any) => {
      setConversationId(res.data.conversation_id)
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to generate mockup')
    }
  })

  function pollForResult() {
    if (!conversationId) return;

    setResult(prev => ({ ...prev, status: 'pending' }))
    const interval = setInterval(() => {
      axios.get(route('ai.mockup.result', { conversationId }))
        .then(res => {
          if (res.status === 200) {
            message.success('Mockup generated successfully!')
            setResult({
              status: 'success',
              url: res.data.url,
              fileName: res.data.file_name || 'mockup.png'
            })
            clearInterval(interval)
          }
        })
        .catch(err => {
          if (err.response?.status === 202) {
          } else {
            message.error(err?.response?.data?.message || 'Failed to get mockup result')
            setResult(prev => ({ ...prev, status: 'error' }))
            clearInterval(interval)
          }
        })
    }, 5000)

    return () => clearInterval(interval)
  }

  useEffect(pollForResult, [conversationId])

  // Derived state

  const imagesLoading = artworkIds.length > 0 && (mediaQuery.isLoading || mediaQuery.isFetching || mediaQuery.isPending)
  const showButton = selectedImageIndex !== null && selectedEnvironment !== null && !conversationId

  return (
    <div className="flex flex-col gap-20">
      {!conversationId && (
        <>
          {/* No resources selected */}
          {resources.length === 0 && (
            <FlexBox direction="col" >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No resources selected"
              />
              <HugeiconsIcon icon={HandPointingDown01Icon} strokeWidth={1} size={64} className="animate-bounce text-muted" />
            </FlexBox>
          )}

          {/* Selection Flow */}
          <div className="flex flex-col gap-10" >

            {/* Select an image */}

            <AnimatedContainer
              condition={artworkIds.length > 0}
              className="flex flex-col gap-3"
            >
              <NumberedSection
                number={1}
                title="Select an image"
                description="Choose a well-cropped, main image to use as the reference base for generating the room mockup."
              />
              <div
                className="mt-3"
              >
                {imagesLoading ?
                  <LoadingSpinner />
                  :
                  <>
                    {medias.length === 0 && (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No images found in resources"
                      />
                    )}
                    {medias.length > 0 && (
                      <ImageGroupFlex
                        images={medias.map((media: any) => media.urls.thumb)}
                        size="sm"
                        className="rounded-lg"
                        onClick={handleImageClick}
                        selectedIndex={selectedImageIndex ?? undefined}
                        setSelectedIndex={setSelectedImageIndex}
                      />
                    )}
                  </>
                }
              </div>
            </AnimatedContainer>

            {/* Select environment */}

            <AnimatedContainer
              condition={selectedImageIndex !== null && !imagesLoading}
              type="fadeUp"
              className="flex flex-col gap-3"
            >
              <NumberedSection
                number={2}
                title="Select environment"
              />
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                options={Object.entries(MOCKUP_ENVIRONMENTS).map(([value, label]) => ({ value, label }))}
                value={selectedEnvironment ?? undefined}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
              />
            </AnimatedContainer>
          </div>

          {/* Generate Button */}
          <AnimatedContainer
            condition={showButton}
            type="fadeUp"
            className="flex justify-end"
          >
            <Button
              type="primary"
              icon={<HugeiconsIcon icon={AiMagicIcon} />}
              onClick={() => generateMutation.mutate()}
              loading={generateMutation.isPending}
            >
              Generate Mockup
            </Button>
          </AnimatedContainer>
        </>
      )}

      {result.status === 'pending' && (
        <div className="py-5">
          <LoadingAi
            message="Generating Mockup..."
          />
        </div>
      )}

      {result.status === 'success' && result.url && (
        <div className="flex flex-col gap-3">
          <div className="text-lg font-semibold">Here is your generated mockup</div>
          <div
            className="max-h-[400px] w-auto max-w-100"
          >
            <Image
              src={result.url}
              alt="Generated Mockup"
              className="max-h-100 aspect-auto rounded-lg shadow"
            />
          </div>
          <FlexBox direction="col" alignItems="start" gap={2} >
            <Button
              type="default"
              icon={<HugeiconsIcon icon={DashboardSquareAddIcon} size={20} />}
            >
              Add to Artwork Images
            </Button>
            <Button
              type="default"
              icon={<HugeiconsIcon icon={Download01Icon} size={20} />}
              onClick={() => downloadFile({ url: result.url ?? '', fileName: result.fileName }) }
            >
              Download
            </Button>
          </FlexBox>
        </div>
      )}
    </div>
  )
}

export default Mockup
