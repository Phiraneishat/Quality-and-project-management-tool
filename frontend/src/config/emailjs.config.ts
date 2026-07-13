// ─────────────────────────────────────────────────────────────────────────────
// EmailJS Configuration
// ─────────────────────────────────────────────────────────────────────────────
// To connect this to YOUR Gmail account:
//
//  1. Go to https://www.emailjs.com and create a free account
//
//  2. Add a new Email Service:
//     Dashboard → Email Services → Add New Service → Gmail
//     Connect your Gmail account via OAuth
//     Copy the "Service ID" (looks like: service_xxxxxx)
//
//  3. Create an Email Template:
//     Dashboard → Email Templates → Create New Template
//     Paste the template below in the "Content" editor:
//
//     Subject:  [QualityDesk] {{inquiry_type}} — {{subject}}
//     From:     {{from_name}} <{{from_email}}>
//     Reply-To: {{from_email}}
//     Body:
//       Name:    {{from_name}}
//       Email:   {{from_email}}
//       Type:    {{inquiry_type}}
//       Priority:{{priority}}
//       Message:
//       {{message}}
//
//     Copy the "Template ID" (looks like: template_xxxxxx)
//
//  4. Get your Public Key:
//     Dashboard → Account → General → Public Key
//     (looks like: AbCdEfGhIjKlMnOp)
//
//  5. Replace the placeholder values below with your actual IDs:
// ─────────────────────────────────────────────────────────────────────────────

export const EMAILJS_CONFIG = {
  SERVICE_ID:  'service_REPLACE_ME',   // ← paste your Service ID here
  TEMPLATE_ID: 'template_REPLACE_ME',  // ← paste your Template ID here
  PUBLIC_KEY:  'PUBLIC_KEY_REPLACE_ME', // ← paste your Public Key here

  // The Gmail address that will RECEIVE all contact form submissions
  TO_EMAIL: 'your-gmail@gmail.com',    // ← paste your Gmail address here
};
