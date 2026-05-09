import { useWindow } from "@/hooks/useWindow";
import AiAssistantButton from "./AI/AiAssistantButton";
import FlexBox from "./Containers/FlexBox";
import NotificationsDropdown from "./NotificationsDropdown";
import QuickCreateDropdown from "./QuickCreateDropdown";
import TokensCounter from "./Tokens/TokensCounter";
import UserMenu from "./UserMenu";

function TopbarActions() {

  const { windowWidth } = useWindow()

  return (
    <div className="flex items-center gap-4">
      <FlexBox>
        <AiAssistantButton showText={windowWidth >= 640} />
        <TokensCounter showBalance={windowWidth >= 640} />
      </FlexBox>
      <FlexBox gap={2} >
        <QuickCreateDropdown />
        <NotificationsDropdown />
      </FlexBox>
      <UserMenu />
    </div>
  )
}

export default TopbarActions;
