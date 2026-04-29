import { useAiAssistant } from "@/contexts/AiAssistantContext"
import colors from "@/Themes/theme"
import { AiContentGenerator01Icon, AiSearch02Icon, RoboticIcon, Sofa01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import FlexBox from "../Containers/FlexBox"
import ItemRow from "../Containers/ItemRow"

function MainMenu() {

  const { setWidgetEnabled } = useAiAssistant()

  const AiMenuItems = [
    {id: 'mockup', icon: <HugeiconsIcon icon={Sofa01Icon} />, label: 'Create room mockup image'},
    {id: 'artwork_description' , icon: <HugeiconsIcon icon={AiContentGenerator01Icon} />, label: 'Generate artwork description'},
    {id: 'financial_analysis', icon: <HugeiconsIcon icon={AiSearch02Icon} />, label: 'Financial analysis'},
  ]

  return (
    <div>
      <FlexBox alignItems="end" gap={3} className="mb-5">
        <HugeiconsIcon icon={RoboticIcon} size={32} color={colors.primary[500]} />
        <div className="text-lg">
          How can I help you?
        </div>
      </FlexBox>
      <div className="flex flex-col gap-2">
        {AiMenuItems.map(item => (
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
