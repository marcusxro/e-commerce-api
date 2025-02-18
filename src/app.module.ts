import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ClerkMiddleware } from './users/middleware/clerk.middleware';
import { ClerkClientProvider } from './users/helpers/clerk-client.provider';
import { AuthModule } from './users/auth/auth.module';
import { ClerkAuthGuard } from './users/auth/clerk-auth.guard';
import { ItemsModule } from './items/items.module';
import { ApiKeyService } from './Service/api.key.service';
import { ApiKey } from './Entities/api.entity';


@Module({
  controllers: [AppController],
  providers: [
    AppService,
    ApiKeyService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    }
  ],
  imports: [
    // AuthModule,
    TypeOrmModule.forFeature([ApiKey]), // Register ApiKey entity
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        ssl: {
          rejectUnauthorized: false,
        }
      }),
    }),
    ThrottlerModule.forRoot([{
      name: 'long',
      ttl: 60000,
      limit: 100, // requests per ttl
    },
    {
      name: 'short',
      ttl: 1000,
      limit: 3, // requests per ttl
    }
  ]),
    ItemsModule
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClerkMiddleware).forRoutes('*'); // Apply to all routes
  }
}
