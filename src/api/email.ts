export interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (request: EmailRequest) => {
  // Implementation for sending email
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
};
