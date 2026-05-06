import { useAiAssistant } from "@/contexts/AiAssistantContext";
import { AiResource } from "@/types/aiResource";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Dropdown, Menu } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ArtworkFinderModal from "../Artworks/ArtworkFinderModal";
import Container from "../Container";
import FlexBox from "../Containers/FlexBox";
import ResourceChips from "../ResourceChips";

function Resources() {

  const { aiDrawerOpen, resources, setResources } = useAiAssistant()
  const [showArtworkFinder, setShowArtworkFinder] = useState(false)

  const url = new URL(window.location.href)
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const currentModelType = pathSegments[0]
  const currentModelId = Number(pathSegments[1])

  function getResource(type: string, id: number) {
    axios.post('/ai/get-resource', {
      model_type: type,
      model_id: id
    }).then(res => {
      const response = res.data;
      addResource(type, id, response.image, response.name)
    });
  }

  function addResource(type: string, id: number, image: string, name: string) {
    if (resources.some((resource: AiResource) => resource.type === type && resource.id === id)) {
      return;
    }
    setResources((prev: AiResource[]) => [
      ...prev,
      {
        type: type,
        id: id,
        image: image,
        name: name
      }
    ]);
  }

  useEffect(() => {
    if (aiDrawerOpen && currentModelType && currentModelId) {
      if (!resources.some((resource: AiResource) => resource.type === currentModelType && resource.id === currentModelId)) {
        getResource(currentModelType, currentModelId)
      }
    }
  }, [aiDrawerOpen])

  useEffect(() => {
    return () => {
      setResources([])
    }
  }, [currentModelId, currentModelType])

  return (
    <>
      <Container
        label="Resources"
        className={resources.length === 0 ? '!border-primary-500 border-2' : ''}
      >
        <FlexBox wrapping="wrap" >
          {resources.map((resource: AiResource, index: number) => (
            <ResourceChips
              key={index}
              resource={resource}
              onClose={() => setResources((prev: AiResource[]) => prev.filter((_, i) => i !== index))}
            />
          ))}
          <Dropdown
            popupRender={() => (
              <Menu
                items={[
                  {
                    key: 'artwork',
                    label: 'Artwork',
                    onClick: () => setShowArtworkFinder(true)
                  },
                  {
                    key: 'contact',
                    label: 'Contact'
                  },
                ]}
              />
            )}
          >
            <Button
              variant="filled"
              color="default"
              icon={<HugeiconsIcon icon={AddIcon} />}
            />
          </Dropdown>
        </FlexBox>
      </Container>
      <ArtworkFinderModal
        show={showArtworkFinder}
        onClose={() => setShowArtworkFinder(false)}
        onSelect={(artwork) => addResource('artworks', artwork.id, artwork.main_image_thumb_url, artwork.title)}
      />
    </>
  )
}

export default Resources
