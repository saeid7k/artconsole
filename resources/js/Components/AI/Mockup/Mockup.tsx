import AnimatedContainer from "@/Components/AnimatedContainer"
import NumberedSection from "@/Components/Containers/NumberedSection"
import ImageGroupFlex from "@/Components/ImageGroupFlex"
import LoadingSpinner from "@/Components/LoadingSpinner"
import { useAiAssistant } from "@/contexts/AiAssistantContext"
import { AiResource } from "@/types/aiResource"
import { AiMagicIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { Button, Empty, Radio } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"

function Mockup() {

  const { resources } = useAiAssistant()

  const isInitialRender = useRef(true)
  const [medias, setMedias] = useState<any[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null)

  const artworkIds = resources.filter((resource: AiResource) => resource.type === 'artworks').map((resource: AiResource) => resource.id)

  const mediaQuery = useQuery({
    queryKey: ['mockupMedias', artworkIds],
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

  const imagesLoading = artworkIds.length > 0 && (mediaQuery.isLoading || mediaQuery.isFetching || mediaQuery.isPending)

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col gap-10" >
        <div className="flex flex-col gap-3">
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
        </div>

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
            options={[
              { label: 'Art Gallery', value: 'art_gallery' },
              { label: 'Living Room', value: 'living_room' },
              { label: 'Bedroom', value: 'bedroom' },
              { label: 'Office', value: 'office' },
            ]}
            value={selectedEnvironment ?? undefined}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
          />
        </AnimatedContainer>
      </div>

      <AnimatedContainer
        condition={selectedImageIndex !== null && selectedEnvironment !== null}
        type="fadeUp"
        className="flex justify-end"
      >
        <Button
          type="primary"
          size="large"
          icon={<HugeiconsIcon icon={AiMagicIcon} />}
        >
          Generate Mockup
        </Button>
      </AnimatedContainer>
    </div>
  )
}

export default Mockup
