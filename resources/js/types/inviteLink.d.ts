export interface InviteLinkProps {
  id: number;
  gallery_id: number;
  user_id: number;
  email: string;
  token: string;
  settings: Record<string, any>;
  expires_at: string | null;
  registered_at: string | null;
  created_at: string;
  updated_at: string;
}
