import nodemailer from "nodemailer";
import { AppError } from "./appError.js";

export class EmailUtils {
    private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
    static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email Delivery Failed:', error);
      throw new AppError('Failed to dispatch email. Please verify SMTP settings', 500);
    }
  }

  static async sendOTPEmail(to: string, otp: string, purpose: string): Promise<void> {
    const title = purpose === 'email_verification' ? 'Email Verification Code' : 'Password Reset OTP';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>${title}</h2>
        <p>Your one-time security verification code is:</p>
        <h1 style="color: #2563eb; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>. If you did not request this, ignore this email.</p>
      </div>
    `;
    await this.sendEmail(to, title, html);
  }
}