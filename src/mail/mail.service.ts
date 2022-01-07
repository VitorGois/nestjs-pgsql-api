import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
  ) { }

  public async sendConfirmationMail(user: User): Promise<void> {
    const mail: ISendMailOptions = {
      to: user.email,
      from: 'AppTest<noreply@application.com>',
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }
}