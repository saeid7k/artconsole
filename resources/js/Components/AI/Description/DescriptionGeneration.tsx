import AnimatedContainer from "@/Components/AnimatedContainer";
import Container from "@/Components/Containers/Container";
import FlexBox from "@/Components/Containers/FlexBox";
import NumberedSection from "@/Components/Containers/NumberedSection";
import LoadingAi from "@/Components/Loaders/LoadingAi";
import ResourceChips from "@/Components/ResourceChips";
import { DESCRIPTION_LENGTHS } from "@/constants/Ai/descriptionLengths";
import CONFIGS from "@/constants/configs.json";
import { useAiAssistant } from "@/contexts/AiAssistantContext";
import usePollAssistantMessage from "@/hooks/usePollAssistantMessage";
import { AiResource } from "@/types/aiResource";
import { AiMagicIcon, HandPointingDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Empty, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import DescriptionResponse from "./DescriptionResponse";

function DescriptionGeneration() {

  // Context

  const user = usePage()?.props?.auth?.user
  const { resources } = useAiAssistant()

  // State and Hooks

  const [selectedResource, setSelectedResource] = useState<AiResource | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const { status, agentMessage } = usePollAssistantMessage(conversationId)

  // Derived state

  const artworkResources = resources.filter((resource: AiResource) => resource.type === 'artworks')
  const artworkIds = artworkResources.map((resource: AiResource) => resource.id)


  // Queries and Mutations

  const generateMutation = useMutation({
    mutationKey: ['generateDescription', selectedResource?.id, selectedLength],
    mutationFn: () => axios.post(route('ai.description.generate'), {
      artwork_id: selectedResource?.id,
      length: selectedLength,
    }),
    onSuccess: (res: any) => {
      setConversationId(res.data.conversation_id)
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to generate description')
    }
  })

  // Effects

  useEffect(() => {
    if (artworkResources.length === 1) {
      setSelectedResource(artworkResources[0])
    } else if (artworkResources.length === 0) {
      setSelectedResource(null)
    }
  }, [artworkResources])

  const showButton = selectedLength !== null && selectedResource !== null && !conversationId
  const tokenAvailable = (user?.token_balance ?? 0) >= CONFIGS.ai.token_usage.description

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
                  <Container
                    rootClassName={twMerge(
                      "grow border-2 cursor-pointer select-none",
                      selectedLength === length.value ? 'border-primary-500' : 'border-gray-500/20 hover:border-gray-500/50'
                    )}
                    borderStyle="solid"
                    onClick={() => setSelectedLength(length.value)}
                  >
                    <div>{length.label}</div>
                    <div className="description">{length.description}</div>
                  </Container>
                ))}
              </FlexBox>
            </AnimatedContainer>
          </div>

          {/* Generate Button */}
          <AnimatedContainer
            condition={showButton}
            type="fadeUp"
          >
            <div
              className="flex justify-end"
            >
              <Button
                type="primary"
                icon={<HugeiconsIcon icon={AiMagicIcon} />}
                onClick={() => generateMutation.mutate()}
                loading={generateMutation.isPending}
                disabled={!tokenAvailable}
              >
                Generate Description
              </Button>
            </div>
            {!tokenAvailable && (
              <Alert
                title={`You need at least ${CONFIGS.ai.token_usage.description} tokens to generate a description.`}
                type="warning"
                showIcon
                className="mt-3"
              />
            )}
          </AnimatedContainer>
        </>
      )}

      {status === 'pending' && (
        <div className="py-5">
          <LoadingAi
            message="Generating Description..."
          />
        </div>
      )}

      {status === 'success' && agentMessage && (
        <div className="flex flex-col gap-3">
          <div className="text-lg font-semibold">Here is your generated description</div>
          <DescriptionResponse message={agentMessage} />
        </div>
      )}
    </div>
  )
}

export default DescriptionGeneration;
