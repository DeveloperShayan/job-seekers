import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  /**
   * Send Emails
   * @param email
   * @param subject
   * @param template
   * @param data
   */
  async sendMail(
    email: string,
    subject: string,
    template: string,
    data: any,
  ): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject,
        template,
        context: {
          baseUrl: this.config.get('CLIENT_BASE_URL'),
          ...data,
        },
      })
      .catch((Error) => {
        console.log(Error);
        throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
      });
  }
}
