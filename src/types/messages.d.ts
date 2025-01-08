export interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  message_type: 'direct' | 'system' | 'notification';
  related_entity_id?: string;
  related_entity_type?: string;
  sender: {
    name: string;
  };
  recipient: {
    name: string;
  };
}