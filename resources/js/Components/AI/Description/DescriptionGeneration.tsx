import AnimatedContainer from "@/Components/AnimatedContainer";
import BlockContainer from "@/Components/Containers/BlockContainer";
import FlexBox from "@/Components/Containers/FlexBox";
import NumberedSection from "@/Components/Containers/NumberedSection";
import ResourceChips from "@/Components/ResourceChips";
import { DESCRIPTION_LENGTHS } from "@/constants/Ai/descriptionLengths";
import { useAiAssistant } from "@/contexts/AiAssistantContext";
import { AiResource } from "@/types/aiResource";
import { AiMagicIcon, HandPointingDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Empty } from "antd";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function DescriptionGeneration() {

  // Context and hooks

  const { resources } = useAiAssistant()

  const [selectedResource, setSelectedResource] = useState<AiResource | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)

  // Derived state

  const artworkResources = resources.filter((resource: AiResource) => resource.type === 'artworks')
  const artworkIds = artworkResources.map((resource: AiResource) => resource.id)

  // Effects

  useEffect(() => {
    if (artworkResources.length === 1) {
      setSelectedResource(artworkResources[0])
    }
  }, [artworkResources])

  const showButton = selectedLength !== null && selectedResource !== null && !conversationId

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

            {/* Select an artwork */}

            <AnimatedContainer
              condition={artworkIds.length > 0}
              className="flex flex-col gap-3"
            >
              <NumberedSection
                number={1}
                title="Select an artwork"
                description="Choose an artwork to generate a detailed description for."
              />
              <div
                className="mt-3"
              >
                <FlexBox wrapping="wrap">
                  {artworkResources.map((resource: AiResource) => (
                    <div
                      onClick={() => setSelectedResource(resource)}
                      className="cursor-pointer"
                    >
                      <ResourceChips
                        key={resource.id}
                        resource={resource}
                        closable={false}
                        selected={selectedResource?.id === resource.id}
                      />
                    </div>
                  ))}
                </FlexBox>
              </div>
            </AnimatedContainer>

            {/* Select Length */}

            <AnimatedContainer
              condition={selectedResource !== null}
              type="fadeUp"
              className="flex flex-col gap-3"
            >
              <NumberedSection
                number={2}
                title="Select Length"
              />
              <FlexBox wrapping="wrap" className="w-full max-w-[600px]">
                {DESCRIPTION_LENGTHS.map((length) => (
                  <BlockContainer
                    className={twMerge(
                      "grow border-2 cursor-pointer select-none",
                      selectedLength === length.value ? 'border-primary-500' : 'border-gray-500/20 hover:border-gray-500/50'
                    )}
                    borderStyle="solid"
                    onClick={() => setSelectedLength(length.value)}
                  >
                    <div>{length.label}</div>
                    <div className="description">{length.description}</div>
                  </BlockContainer>
                ))}
              </FlexBox>
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
              // onClick={() => generateMutation.mutate()}
              // loading={generateMutation.isPending}
            >
              Generate Description
            </Button>
          </AnimatedContainer>
        </>
      )}

      {/* {result.status === 'pending' && (
        <div className="py-5">
          <LoadingAi
            message="Generating Mockup..."
          />
        </div>
      )}

      {result.status === 'success' && result.agentMessage && (
        <div className="flex flex-col gap-3">
          <div className="text-lg font-semibold">Here is your generated mockup</div>
          <MockupResponse message={result.agentMessage} />
        </div>
      )} */}
    </div>
  )
}

export default DescriptionGeneration;
