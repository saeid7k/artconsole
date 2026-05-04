import AI_MENU_ITEMS from "@/constants/Ai/aiMenuItems"
import { useAiAssistant } from "@/contexts/AiAssistantContext"
import colors from "@/Themes/theme"
import { RoboticIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import FlexBox from "../Containers/FlexBox"
import ItemRow from "../Containers/ItemRow"

function MainMenu() {

  const { setWidgetEnabled } = useAiAssistant()

  return (
    <div>
      <FlexBox alignItems="end" gap={3} className="mb-5">
        <HugeiconsIcon icon={RoboticIcon} size={32} color={colors.primary[500]} />
        <div className="text-lg">
          How can I help you?
        </div>
      </FlexBox>
      <div className="flex flex-col gap-2">
        {AI_MENU_ITEMS.map(item => (
          <ItemRow
            key={item.id}
            icon={item.icon}
            onClick={() => setWidgetEnabled(item.id)}
          >
            {item.label}
          </ItemRow>
        ))}
      </div>
    </div>
  )
}

export default MainMenu
