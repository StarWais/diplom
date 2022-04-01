import { EmailOptions } from './configuration';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    const emailConfig = this.configService.get<EmailOptions>('emailOptions');
    return {
      transport: emailConfig.transport,
      defaults: {
        from: `${emailConfig.author.name} <${emailConfig.author.email}>`,
      },
      template: {
        dir: 'src/templates/pages',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
