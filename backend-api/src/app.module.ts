import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bullmq'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'

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
import { WebsocketsModule }     from './websockets/websockets.module'
import { JobsModule }           from './jobs/jobs.module'

// Configuration files
import appConfig      from './config/app.config'
import databaseConfig from './config/database.config'
import redisConfig    from './config/redis.config'
import mongodbConfig  from './config/mongodb.config'

// ─────────────────────────────────────────────────────────
// AppModule — Root module. Imports all feature modules.
// Strict module boundaries enforced: modules communicate
// via events/interfaces, never direct imports across domains.
// ─────────────────────────────────────────────────────────

@Module({
  imports: [
    // Configuration (validates .env at startup)
    ConfigModule.forRoot({
      isGlobal:   true,
      load:       [appConfig, databaseConfig, redisConfig, mongodbConfig],
      envFilePath: '.env',
    }),

    // Rate limiting — guards all routes against abuse
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Event bus — enables decoupled module communication
    EventEmitterModule.forRoot(),

    // Background job scheduling (CRON)
    ScheduleModule.forRoot(),

    // BullMQ — distributed job queues via Redis
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host:     process.env.REDIS_HOST ?? 'localhost',
          port:     parseInt(process.env.REDIS_PORT ?? '6379'),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),

    // Feature modules (decoupled, no cross-imports)
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
    WebsocketsModule,
    JobsModule,
  ],
})
export class AppModule {}
