import { AiContentGenerator01Icon, Sofa01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CONFIGS from "@/constants/configs.json";

const AI_MENU_ITEMS = [
  {
    id: 'mockup',
    icon: <HugeiconsIcon icon={Sofa01Icon} />,
    label: 'Create room mockup image',
    agent: 'App\\Ai\\Agents\\MockupAgent',
    token: CONFIGS.ai.token_usage.mockup
  },
  {
    id: 'artwork_description' ,
    icon: <HugeiconsIcon icon={AiContentGenerator01Icon} />,
    label: 'Generate artwork description',
    agent: 'App\\Ai\\Agents\\DescriptionAgent',
    token: CONFIGS.ai.token_usage.description
  }
]

function getAgentIdByClass(agentClass: string) {
  const item = AI_MENU_ITEMS.find(item => item.agent === agentClass);
  return item ? item.id : 'assistant';
}

export { AI_MENU_ITEMS as default, getAgentIdByClass };

