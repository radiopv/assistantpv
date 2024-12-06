import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

interface EmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export const sendEmail = async (emailData: EmailRequest): Promise<EmailResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};