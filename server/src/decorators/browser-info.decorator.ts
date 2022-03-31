import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as parseUserAgent from 'ua-parser-js';

export interface BrowserInfo {
  browser: string;
  ip: string;
}

export const CurrentBrowserInfo = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
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
