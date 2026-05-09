import AI_MENU_ITEMS from "@/constants/Ai/aiMenuItems"
import { useAiAssistant } from "@/contexts/AiAssistantContext"
import colors from "@/Themes/theme"
import { RoboticIcon, TokenCircleIcon } from "@hugeicons/core-free-icons"
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
            <FlexBox justifyContent="between">
              <div>{item.label}</div>
              <FlexBox className="opacity-75">
                <div className="font-light">{item.token}</div>
                <HugeiconsIcon icon={TokenCircleIcon} color={colors.yellow[600]} size={16} />
              </FlexBox>
            </FlexBox>
          </ItemRow>
        ))}
      </div>
    </div>
  )
}

export default MainMenu
