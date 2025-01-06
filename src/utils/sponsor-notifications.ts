import { supabase } from "@/integrations/supabase/client";

export const notifyActiveSponsor = async (
  childId: string, 
  subject: string, 
  content: string
) => {
  try {
    // Fetch child details with current sponsorship information
    const { data: child } = await supabase
      .from('children')
      .select(`
        name,
        sponsorships (
          sponsor_id,
          status,
          end_date
        )
      `)
      .eq('id', childId)
      .single();

    // Check if child exists and has an active sponsorship
    if (child?.sponsorships && child.sponsorships.length > 0) {
      // Find active sponsorship (no end_date and status is 'active')
      const activeSponsorship = child.sponsorships.find(
        s => s.status === 'active' && !s.end_date
      );

      if (activeSponsorship?.sponsor_id) {
        // Send message only to the active sponsor
        await supabase.from('messages').insert({
          recipient_id: activeSponsorship.sponsor_id,
          subject,
          content,
          is_read: false
        });

        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error notifying sponsor:', error);
    return false;
  }
};