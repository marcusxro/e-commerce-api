import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import corsOptions from './users/config/config-options';
import { ApiKeyGuard } from './Guard/api.key.guard';
import { ConfigService } from '@nestjs/config';
import { ApiKeyService } from './Service/api.key.service';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    }),
  );


  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
