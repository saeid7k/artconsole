import AiAssistantButton from "./AI/AiAssistantButton";
import NotificationsDropdown from "./NotificationsDropdown";
import QuickCreateDropdown from "./QuickCreateDropdown";
import UserMenu from "./UserMenu";

function TopbarActions() {
  return (
    <div className="flex items-center gap-4">
      <AiAssistantButton />
      <div className="flex items-center gap-2">
        <QuickCreateDropdown />
        <NotificationsDropdown />
      </div>
      <UserMenu />
    </div>
  )
}

export default TopbarActions;
