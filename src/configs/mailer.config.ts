import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

const mail_smtpDomain = process.env.MAIL_SMTP_DOMAIN as string;
const mail_user = process.env.MAIL_USERNAME as string;
const mail_password = process.env.MAIL_PASSWORD as string;

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  transport: `smtps://${mail_user}:${mail_password}@smtp.${mail_smtpDomain}.com`
}