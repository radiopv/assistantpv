import emailjs from '@emailjs/browser';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (!emailjsPublicKey || !emailjsServiceId || !emailjsTemplateId) {
  console.error('Missing EmailJS environment variables. Please check your .env file.');
}

if (emailjsPublicKey) {
  emailjs.init(emailjsPublicKey);
}

export interface EmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export const sendEmail = async (emailData: EmailRequest): Promise<EmailResponse> => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your environment variables.');
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Unauthorized');
    }

    if (!emailjsServiceId || !emailjsTemplateId) {
      throw new Error('EmailJS configuration is missing');
    }

    const templateParams = {
      to_email: emailData.to.join(', '),
      subject: emailData.subject,
      message: emailData.html,
      from_name: 'Your Organization',
      reply_to: emailData.from
    };

    const response = await emailjs.send(
      emailjsServiceId,
      emailjsTemplateId,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};