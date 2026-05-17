import { AiMessage } from "./aiMessage";
import { UserProps } from "./user";

export interface AgentConversationProps {
  id: string;
  user_id?: number | null;
  title: string;
  created_at: string;
  updated_at: string;

  // Relationships
  messages?: AiMessage[];
  user?: UserProps | null;
}
