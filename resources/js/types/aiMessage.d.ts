import { ArtworkProps } from "./artwork";

export interface AiMessage {
  id: string;
  conversation_id: string;
  user_id: number;
  agent: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Array<{
    type: string;
    media_id: number;
  }> | null;
  tool_calls?: any[] | null;
  tool_results?: any[] | null;
  usage?: any[] | null;
  meta?: any[] | null;
  created_at: string;
  updated_at: string;

  // Optional relationships
  artwork?: ArtworkProps;
}
