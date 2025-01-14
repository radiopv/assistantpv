import { supabase } from "@/integrations/supabase/client";

export interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (request: EmailRequest) => {
  console.log('Sending email with request:', request);
  
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: request
  });

  if (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }

  console.log('Email sent successfully:', data);
  return data;
};