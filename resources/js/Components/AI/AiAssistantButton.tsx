import { useApp } from "@/contexts/AppContext";
import { AiMagicIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";

function AiAssistantButton() {

  const { setAiDrawerOpen } = useApp()

  return (
    <Button
      variant="outlined"
      icon={<HugeiconsIcon icon={AiMagicIcon} size={24}  className="text-primary-600 dark:text-primary-400 animate-pulse" />}
      onClick={() => setAiDrawerOpen(true)}
    >
      AI Assistant
    </Button>
  )
}

export default AiAssistantButton;
