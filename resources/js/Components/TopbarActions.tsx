import AiAssistantButton from "./AI/AiAssistantButton";
import FlexBox from "./Containers/FlexBox";
import NotificationsDropdown from "./NotificationsDropdown";
import QuickCreateDropdown from "./QuickCreateDropdown";
import TokensCounter from "./Tokens/TokensCounter";
import UserMenu from "./UserMenu";

function TopbarActions() {
  return (
    <div className="flex items-center gap-4">
      <FlexBox>
        <AiAssistantButton />
        <TokensCounter />
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
