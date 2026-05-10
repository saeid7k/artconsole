export interface TokenTransaction {
  id: number;
  user_id: number;
  type: 'top_up' | 'credit' | 'usage' | 'refund';
  amount: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}
