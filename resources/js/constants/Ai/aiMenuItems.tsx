import { ucFirst } from "@/utils/stringHelper";
import { AiContentGenerator01Icon, AiSearch02Icon, Sofa01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const AI_MENU_ITEMS = [
  {
    id: 'mockup',
    icon: <HugeiconsIcon icon={Sofa01Icon} />,
    label: 'Create room mockup image',
    agent: 'App\\Ai\\Agents\\MockupAgent'
  },
  {
    id: 'artwork_description' ,
    icon: <HugeiconsIcon icon={AiContentGenerator01Icon} />,
    label: 'Generate artwork description',
    agent: 'App\\Ai\\Agents\\ArtworkDescriptionAgent'
  },
  {
    id: 'financial_analysis',
    icon: <HugeiconsIcon icon={AiSearch02Icon} />,
    label: 'Financial analysis',
    agent: 'App\\Ai\\Agents\\FinancialAnalysisAgent'
  },
]

function getAgentTitleByClass(agentClass: string) {
  const item = AI_MENU_ITEMS.find(item => item.agent === agentClass);
  return item ? ucFirst(item.id.replaceAll('_', ' ')) : 'AI Assistant';
}

export {AI_MENU_ITEMS as default, getAgentTitleByClass}
