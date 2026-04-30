import { AiAssistantProvider } from "@/contexts/AiAssistantContext";
import { useApp } from "@/contexts/AppContext";
import { ucFirst } from "@/utils/stringHelper";
import { RoboticIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb, Drawer } from "antd";
import { useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import MainMenu from "./MainMenu";
import Mockup from "./Mockup/Mockup";
import Resources from "./Resources";

function AiDrawer() {

  const { aiDrawerOpen, setAiDrawerOpen } = useApp()

  const [widgetEnabled, setWidgetEnabled] = useState<string | null>(null)
  const [resources, setResources] = useState<{type: string, id: number, image: string, name: string }[]>([])

  function handleClose() {
    setAiDrawerOpen(false)
    setTimeout(() => {
      setWidgetEnabled(null)
    }, 500);
  }

  return (
    <Drawer
      open={aiDrawerOpen}
      onClose={handleClose}
      defaultSize={500}
      resizable
      title='AI Assistant'
    >
      <AiAssistantProvider value={{ aiDrawerOpen, widgetEnabled, setWidgetEnabled, resources, setResources }}>
        <div className="relative overflow-x-hidden h-full flex flex-col gap-4 justify-between">

          {/* Main Menu */}
          <AnimatedContainer
            condition={!widgetEnabled}
            type="slideLeft"
            className="absolute top-0 w-full"
          >
            <MainMenu />
          </AnimatedContainer>

          {/* Body */}
          <div>
            <AnimatedContainer
              condition={!!widgetEnabled}
              type="slideLeft"
            >
              {/* Breadcrumb */}
              <Breadcrumb
                items={[
                  { title: <a><HugeiconsIcon icon={RoboticIcon} size={20} /></a>, onClick: () => setWidgetEnabled(null) },
                  { title: widgetEnabled ? ucFirst(widgetEnabled.replaceAll('_', ' ')) : undefined }
                ]}
                className="sticky top-0 bg-base"
              />

              {/* Widget Content */}
              <div className="pt-2">
                {widgetEnabled === 'mockup' && (
                  <Mockup />
                )}
              </div>
            </AnimatedContainer>
          </div>

          {/* Resources */}
          <div
            className="w-full sticky bottom-0"
          >
            <Resources />
          </div>
        </div>
      </AiAssistantProvider>
    </Drawer>
  )
}

export default AiDrawer;
