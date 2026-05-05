import { ArtworkProps } from "./artwork";

export interface AiMessage {
  id: string;
  conversation_id: string;
  user_id: number;
  agent: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    type: string;
    media_id: number;
  };
  tool_calls?: any[];
  tools_results?: any[];
  usage?: any[];
  meta?: any[];
  created_at: string;
  updated_at: string;

  // Optional relationships
  artwork?: ArtworkProps;
}
