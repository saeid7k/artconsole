import { useApp } from "@/contexts/AppContext";
import { Sofa01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Divider, Drawer } from "antd";

function AiDrawer() {

  const { aiDrawerOpen, setAiDrawerOpen } = useApp()

  const renderItemRow = (icon: React.ReactNode, label: string) => (
    <div
      className="flex items-center gap-1 border px-3 py-2 rounded-lg hover:bg-primary-500/5 transition duration-300 cursor-pointer"
    >
      {icon}
      <div className="self-stretch">
        <Divider orientation="vertical" className="h-[100%]" />
      </div>
      <div>{label}</div>
    </div>
  )

  return (
    <Drawer
      open={aiDrawerOpen}
      onClose={() => setAiDrawerOpen(false)}
      size={500}
      resizable
      title='AI Assistant'
    >
      {renderItemRow(<HugeiconsIcon icon={Sofa01Icon} />, 'Create room mockup image')}
    </Drawer>
  )
}

export default AiDrawer;
