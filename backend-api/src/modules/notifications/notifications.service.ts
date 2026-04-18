import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(adminEmail: string, adminName: string, societyName: string, generatedPassword: string) {
    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `Welcome to SmartSociety 360 - ${societyName} Handover`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background-color: #1e293b; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">SmartSociety 360</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 4px; margin-bottom: 0;">Enterprise Operations Platform</p>
            </div>
            
            <div style="padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0;">Hello ${adminName},</h2>
              <p style="font-size: 16px;">
                Congratulations! The digital infrastructure for <strong>${societyName}</strong> has been successfully compiled and deployed on our global SaaS network.
              </p>
              <p style="font-size: 16px;">
                Your dedicated President/Admin security clearance has been generated. You now have complete authoritative control over your society's operations.
              </p>

              <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; border: 1px dashed #cbd5e1; margin: 32px 0;">
                <h3 style="margin-top: 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Secure Access Credentials</h3>
                <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Platform URL:</strong> <a href="http://localhost:5173/login" style="color: #2563eb; text-decoration: none;">Launch Dashboard →</a></p>
                <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Admin Email ID:</strong> ${adminEmail}</p>
                <p style="margin: 0; font-size: 15px;"><strong>System Password:</strong> <code style="background-color: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-weight: bold; color: #0f172a;">${generatedPassword}</code></p>
              </div>

              <p style="font-size: 13px; color: #64748b; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                ⚠️ <strong>SECURITY DICTATE:</strong> The password provided above is cryptographically generated for initial handover only. You must change it immediately upon your first successful platform authentication.
              </p>
            </div>
          </div>
        `
      });
      this.logger.log(`[SMTP Live Dispatch] Successfully sent Welcome protocol email to ${adminEmail}`);
    } catch (error) {
      this.logger.error(`[SMTP Fatal] Failed to dispatch real email to ${adminEmail}. Check Nodemailer App Passwords.`, error);
    }
  }
}
