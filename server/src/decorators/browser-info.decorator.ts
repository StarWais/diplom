import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as parseUserAgent from 'ua-parser-js';

export interface BrowserInfo {
  browser: string;
  ip: string;
}

export const CurrentBrowserInfo = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    const ip =
      (request.ip.replace('::ffff:', '') as string) || 'Неизвестный IP';
    const parsedUserAgent = parseUserAgent(userAgent);

    return {
      browser: parsedUserAgent.browser.name || 'Неизвестный браузер',
      ip,
    };
  },
);
