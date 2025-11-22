export interface NotificationProps {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message: string;
    link?: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
