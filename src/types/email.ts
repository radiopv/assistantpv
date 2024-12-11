export interface EmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
}