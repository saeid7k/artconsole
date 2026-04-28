import { useApp } from "@/contexts/AppContext";
import { Drawer } from "antd";
import MainMenu from "./MainMenu";
import { useState } from "react";

function AiDrawer() {

  const { aiDrawerOpen, setAiDrawerOpen } = useApp()
  const [aiWidgetsStep, setAiWidgetStep] = useState('main-menu')

  return (
    <Drawer
      open={aiDrawerOpen}
      onClose={() => setAiDrawerOpen(false)}
      size={500}
      resizable
      title='AI Assistant'
    >
      <MainMenu />
    </Drawer>
  )
}

export default AiDrawer;
