import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'

// Prisma (replaces TypeORM + Mongoose)
import { PrismaModule } from './common/prisma/prisma.module'

// Mailer (Global NodeMailer for SMTP)
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

// Feature Modules
import { AuthModule }           from './modules/auth/auth.module'
import { TenantsModule }        from './modules/tenants/tenants.module'
import { UsersModule }          from './modules/users/users.module'
import { PropertyModule }       from './modules/property/property.module'
import { VisitorsModule }       from './modules/visitors/visitors.module'
import { VehiclesModule }       from './modules/vehicles/vehicles.module'
import { AccessControlModule }  from './modules/access-control/access-control.module'
import { FinanceModule }        from './modules/finance/finance.module'
import { AmenitiesModule }      from './modules/amenities/amenities.module'
import { ComplaintsModule }     from './modules/complaints/complaints.module'
import { StaffModule }          from './modules/staff/staff.module'
import { CommunicationsModule } from './modules/communications/communications.module'
import { NotificationsModule }  from './modules/notifications/notifications.module'
import { IoTModule }            from './modules/iot/iot.module'
import { SecurityModule }       from './modules/security/security.module'
import { UtilitiesModule }      from './modules/utilities/utilities.module'
import { ParcelsModule }        from './modules/parcels/parcels.module'
import { MarketplaceModule }    from './modules/marketplace/marketplace.module'
import { ElectionsModule }      from './modules/elections/elections.module'

// Configuration
import appConfig      from './config/app.config'

// ─────────────────────────────────────────────────────────
// AppModule — Root module.
// Uses Prisma for PostgreSQL. TypeORM & Mongoose removed.
// Built-in automated SMTP dispatcher.
// ─────────────────────────────────────────────────────────

@Module({
  imports: [
    // Configuration (validates .env at startup)
    ConfigModule.forRoot({
      isGlobal:   true,
      load:       [appConfig],
      envFilePath: '.env',
    }),

    // Global SMTP Mailer Engine
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_APP_PASSWORD'),
          },
        },
        defaults: {
          from: `"SmartSociety 360" <${config.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Event bus
    EventEmitterModule.forRoot(),

    // Background scheduling
    ScheduleModule.forRoot(),

    // Database (Prisma — global)
    PrismaModule,

    // Feature modules
    AuthModule,
    TenantsModule,
    UsersModule,
    PropertyModule,
    VisitorsModule,
    VehiclesModule,
    AccessControlModule,
    FinanceModule,
    AmenitiesModule,
    ComplaintsModule,
    StaffModule,
    CommunicationsModule,
    NotificationsModule,
    IoTModule,
    SecurityModule,
    UtilitiesModule,
    ParcelsModule,
    MarketplaceModule,
    ElectionsModule,
  ],
})
export class AppModule {}
