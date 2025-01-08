export interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string | null;
  recipient_id: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  message_type: string;
  related_entity_id: string | null;
  related_entity_type: string | null;
  sender: {
    name: string;
    email?: string;
  } | null;
  recipient: {
    name: string;
    email?: string;
  };
}