/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/request-logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query } = req;
    const body = req.body || {};

    this.logger.debug(`${method} ${originalUrl}`);
    this.logger.debug('Query:', query);

    if ('password' in body || 'confirm_password' in body) {
      const sanitizedBody = {
        ...body,
        password: '*****',
        confirm_password: '*****',
      };
      this.logger.debug('Body:', sanitizedBody);
    } else {
      this.logger.debug('Body:', body);
    }

    next();
  }
}
