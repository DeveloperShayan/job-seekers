import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

let secureStatus = true;
if(process.env.MAIL_SECURE == "false") secureStatus = false;
export const mailerConfig = {
  transport: {
    host: process.env.MAIL_HOST,
    secure: secureStatus,
    ignoreTLS: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
  },
  template: {
    dir: join(process.cwd(), 'src', 'templates', 'emails'),
    adapter: new EjsAdapter(),
    options: {
      strict: false,
    },
  },
};
