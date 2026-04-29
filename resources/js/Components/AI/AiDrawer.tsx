import { AiAssistantProvider } from "@/contexts/AiAssistantContext";
import { useApp } from "@/contexts/AppContext";
import { ucFirst } from "@/utils/stringHelper";
import { RoboticIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb, Drawer } from "antd";
import { useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import MainMenu from "./MainMenu";
import Resources from "./Resources";

function AiDrawer() {

  const { aiDrawerOpen, setAiDrawerOpen } = useApp()
  const [widgetEnabled, setWidgetEnabled] = useState<string | null>(null)

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
      size={500}
      resizable
      title='AI Assistant'
    >
      <AiAssistantProvider value={{ aiDrawerOpen, widgetEnabled, setWidgetEnabled }}>
        <div className="relative overflow-x-hidden h-full">

          {/* Main Menu */}
          <AnimatedContainer condition={!widgetEnabled} type="slideLeft" >
            <div className="absolute top-0 w-full">
              <MainMenu />
            </div>
          </AnimatedContainer>

          {/* Breadcrumb */}
          <AnimatedContainer condition={!!widgetEnabled} type="slideLeft" >
            <Breadcrumb
              items={[
                { title: <a><HugeiconsIcon icon={RoboticIcon} size={20} /></a>, onClick: () => setWidgetEnabled(null) },
                { title: widgetEnabled ? ucFirst(widgetEnabled.replaceAll('_', ' ')) : undefined }
              ]}
              className="absolute top-0"
            />
          </AnimatedContainer>

          {/* Widget Body */}
          <AnimatedContainer condition={!!widgetEnabled} type="slideLeft"
            className="absolute top-10"
          >
            body
          </AnimatedContainer>

          {/* Resources */}
          <div
            className="absolute bottom-0 w-full"
          >
            <Resources />
          </div>

        </div>
      </AiAssistantProvider>
    </Drawer>
  )
}

export default AiDrawer;
