import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class MailService {
  private readonly mail_from: string = process.env.MAIL_FROM;

  public constructor(
    private readonly mailerService: MailerService,
  ) { }

  public async sendConfirmationMail(user: User): Promise<void> {
    const mail: ISendMailOptions = {
      to: user.email,
      from: this.mail_from,
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  public async sendRecoverPasswordMail(user: User): Promise<void> {
    const mail: ISendMailOptions = {
      to: user.email,
      from: this.mail_from,
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: user.recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }
}