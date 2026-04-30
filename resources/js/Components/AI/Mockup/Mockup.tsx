import AnimatedContainer from "@/Components/AnimatedContainer"
import NumberedSection from "@/Components/Containers/NumberedSection"
import ImageGroupFlex from "@/Components/ImageGroupFlex"
import LoadingSpinner from "@/Components/LoadingSpinner"
import { useAiAssistant } from "@/contexts/AiAssistantContext"
import { AiResource } from "@/types/aiResource"
import { useQuery } from "@tanstack/react-query"
import { Empty, Radio } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"

function Mockup() {

  const { resources } = useAiAssistant()

  const isInitialRender = useRef(true)
  const [medias, setMedias] = useState<any[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

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

  const imagesLoading = mediaQuery.isLoading || mediaQuery.isFetching || mediaQuery.isPending

  return (
    <div>
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
        className="mt-5 flex flex-col gap-3"
      >
        <NumberedSection
          number={2}
          title="Select environment"
        />
        <Radio.Group
          orientation="vertical"
          options={[
            { label: 'Art Gallery', value: 'art_gallery' },
            { label: 'Living Room', value: 'living_room' },
            { label: 'Bedroom', value: 'bedroom' },
            { label: 'Office', value: 'office' },
          ]}
        />
      </AnimatedContainer>
    </div>
  )
}

export default Mockup
