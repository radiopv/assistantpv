import { supabase } from "@/integrations/supabase/client";

export interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (request: EmailRequest) => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: request
  });

  if (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }

  return data;
};