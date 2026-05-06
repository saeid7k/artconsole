import { AiAssistantProvider } from "@/contexts/AiAssistantContext";
import { useApp } from "@/contexts/AppContext";
import { ucFirst } from "@/utils/stringHelper";
import { RoboticIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb, Button, Drawer } from "antd";
import { useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import MainMenu from "./MainMenu";
import MockupGeneration from "./Mockup/MockupGeneration";
import RecentSessions from "./RecentSessions";
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
      <AiAssistantProvider value={{ aiDrawerOpen, setAiDrawerOpen, widgetEnabled, setWidgetEnabled, resources, setResources }}>
        <div className="relative overflow-x-hidden h-full flex flex-col gap-4 justify-between">

          {/* Main Menu */}
          <AnimatedContainer
            condition={!widgetEnabled}
            type="slideLeft"
            className="absolute top-0 w-full"
          >
            <MainMenu />
            <div className="flex justify-center mt-3">
              <Button
                type="text"
                size="small"
                className="text-muted font-light"
                onClick={() => setWidgetEnabled('recent_sessions')}
              >
                Recent Sessions
              </Button>
            </div>
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
                className="sticky top-0 bg-base dark:!bg-slate-900"
              />

              {/* Widget Content */}
              <div className="pt-2">
                {widgetEnabled === 'mockup' && (
                  <MockupGeneration />
                )}
                {widgetEnabled === 'recent_sessions' && (
                  <RecentSessions />
                )}
              </div>
            </AnimatedContainer>
          </div>

          {/* Resources */}
          <AnimatedContainer condition={widgetEnabled !== 'recent_sessions'} type="fade" speed="slow" >
            <div
              className="w-full sticky bottom-0 z-100"
            >
              <Resources />
            </div>
          </AnimatedContainer>
        </div>
      </AiAssistantProvider>
    </Drawer>
  )
}

export default AiDrawer;
