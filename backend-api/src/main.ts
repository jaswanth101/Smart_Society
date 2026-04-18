import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import compression from 'compression'

// ─────────────────────────────────────────────────────────
// Bootstrap — entry point for the NestJS application.
// Configures global middleware, security headers, Swagger docs,
// and global validation pipe before starting the server.
// ─────────────────────────────────────────────────────────

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security headers (OWASP Top 10 defense)
  app.use(helmet())

  // Gzip compression for all responses
  app.use(compression())

  // Global API prefix
  app.setGlobalPrefix('api/v1')

  // CORS — restrict to known origins in production
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  })

  // Global validation pipe — validates all incoming DTOs
  // Strips unknown fields, forbids non-whitelisted properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:            true,   // Strip unknown fields
      forbidNonWhitelisted: true,   // Throw on unknown fields
      transform:            true,   // Auto-transform to DTO types
      transformOptions:   { enableImplicitConversion: true },
    })
  )

  // ── Swagger / OpenAPI Documentation ─────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SmartSociety 360 API')
      .setDescription('Enterprise SaaS API for residential society management')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth')
      .addTag('Tenants')
      .addTag('Users')
      .addTag('Property')
      .addTag('Visitors')
      .addTag('Finance')
      .addTag('Amenities')
      .addTag('Complaints')
      .addTag('Staff')
      .addTag('IoT')
      .addTag('Communications')
      .addTag('Notifications')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  const port = process.env.PORT ?? 8000
  await app.listen(port)
  console.log(`🚀 SmartSociety 360 API running on: http://localhost:${port}/api/v1`)
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
