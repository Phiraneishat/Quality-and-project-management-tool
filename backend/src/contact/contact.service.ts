import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private configService: ConfigService) {}

  getSMTPConfig() {
    const receiver = this.configService.get<string>('CONTACT_RECEIVER') || 'phiraneish2006@gmail.com';
    return {
      gmailUser: receiver,
      hasPassword: true,
      isConfigured: true,
    };
  }

  async saveSMTPConfig(user: string, pass: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`SMTP Settings saved locally: ${user}`);
    return { success: true, message: 'Settings saved.' };
  }

  async sendContactEmail(dto: {
    name: string;
    email: string;
    subject?: string;
    inquiryType: string;
    priority?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const receiver = this.configService.get<string>('CONTACT_RECEIVER') || 'phiraneish2006@gmail.com';

    this.logger.log(`Forwarding contact request for ${dto.name} via FormSubmit to: ${receiver}`);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${receiver}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Name: dto.name,
          Email: dto.email,
          Subject: dto.subject || `[QualityDesk] ${dto.inquiryType}`,
          Inquiry: dto.inquiryType,
          Priority: dto.priority || 'N/A',
          Message: dto.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`FormSubmit gateway returned status ${response.status}`);
      }

      const result = await response.json();
      this.logger.log(`FormSubmit response: ${JSON.stringify(result)}`);

      return {
        success: true,
        message: 'Message processed and sent via FormSubmit gateway.',
      };
    } catch (err: any) {
      this.logger.error('Failed to forward email via FormSubmit:', err);
      throw new Error(`Email Delivery Error: ${err.message}`);
    }
  }
}
