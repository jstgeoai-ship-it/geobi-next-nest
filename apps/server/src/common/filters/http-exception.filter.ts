import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    // This filter's whole job is to hide raw exception details from the client (so a Postgres
    // error message, a stack trace, etc. never leaks into an API response) — but it was doing
    // that by catching *everything* and never logging, so the real cause was invisible on the
    // server side too, not just the client side. Only the non-HttpException branch needs this:
    // HttpExceptions (BadRequestException, UnauthorizedException, ...) are intentional/expected
    // control flow, not bugs worth alarming on.
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    res.status(status).json(
      typeof message === 'string' ? { message } : message,
    );
  }
}