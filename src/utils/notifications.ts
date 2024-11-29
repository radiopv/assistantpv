import { supabase } from "@/integrations/supabase/client";

interface NeedNotificationParams {
  sponsorId: string;
  childName: string;
  needCategory: string;
  isUrgent: boolean;
}

export const sendNeedNotification = async ({
  sponsorId,
  childName,
  needCategory,
  isUrgent
}: NeedNotificationParams) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: sponsorId,
        type: 'need',
        title: 'Nouveau besoin',
        content: `Un nouveau besoin a été ajouté pour ${childName}: ${needCategory}${isUrgent ? ' (URGENT)' : ''}`
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};