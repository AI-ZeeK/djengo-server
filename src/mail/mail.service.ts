import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { businessWelcomeTemplate } from './templates/business-welcome';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // or 'SES' for Amazon SES
      auth: {
        user: 'mambaaizeek@gmail.com',
        pass: `otvc awdq ojcc wqgs`,
        // user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private loadTemplate(templateName: string, data: any): string {
    const templatePath = path.join(
      __dirname,
      '.',
      'templates',
      `${templateName}.html`,
    );
    let html = fs.readFileSync(templatePath, 'utf8');
    // Replace placeholders with actual data
    for (const key in data) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return html;
  }

  async sendBusinessOtpEmail({
    email,
    name,
    otp,
  }: {
    email: string;
    name: string;
    otp: string;
  }) {
    const html = businessWelcomeTemplate({ name, otp });

    const mailOptions = {
      from: 'turboaizeek@gmail.com',
      to: email,
      subject: 'DJENGO | Verify Your E-Mail Address',
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
