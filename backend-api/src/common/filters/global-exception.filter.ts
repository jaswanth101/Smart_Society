import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

// ─────────────────────────────────────────────────────────
// GlobalExceptionFilter — catches all unhandled exceptions.
// Never returns raw stack traces or DB errors to the client.
// All errors are sanitized and logged server-side.
// ─────────────────────────────────────────────────────────

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx      = host.switchToHttp()
    const request  = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    let status  = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'An unexpected error occurred. Please try again.'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      message = typeof res === 'string'
        ? res
        : (res as { message?: string }).message ?? message
    }

    // Log the full error server-side (never sent to client)
    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    )

    // Return safe, sanitized response
    response.status(status).json({
      success:   false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path:      request.url,
    })
  }
}
