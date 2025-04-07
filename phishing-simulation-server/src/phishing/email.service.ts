import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    from = this.configService.get<string>('EMAIL_FROM'),
  ) {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }

  getPhishingTemplate(
    templateId: string,
    trackingUrl: string,
  ): {
    subject: string;
    html: string;
  } {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const trackingLink = `${baseUrl}/phishing/track/${trackingUrl}`;
    const templates = {
      'password-reset': {
        subject: 'Urgent: Your password needs to be reset',
        html: `
          <html>
            <body>
              <h1>Security Alert</h1>
              <p>We've detected suspicious activity on your account.</p>
              <p>Please <a href="${trackingLink}">click here</a> to reset your password immediately.</p>
              <p>If you ignore this message, your account may be suspended.</p>
              <p>IT Security Team</p>
            </body>
          </html>
        `,
      },
      'account-verification': {
        subject: 'Hello',
        html: `
          <html>
            <body>
<!--              <h1>Account Verification Required</h1>-->
<!--              <p>Your account needs verification to continue using our services.</p>-->
              <p><a href="${trackingLink}">Verify</a></p>
<!--              <p>This is an automated message, please do not reply.</p>-->
            </body>
          </html>
        `,
      },
    };

    return (
      templates[templateId] || {
        subject: 'Important Notification',
        html: `
        <html>
          <body>
            <h1>Important Notification</h1>
            <p>Please <a href="${trackingLink}">click here</a> to view an important message.</p>
          </body>
        </html>
      `,
      }
    );
  }
}
