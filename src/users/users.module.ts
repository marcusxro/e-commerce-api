import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClerkClientProvider } from './helpers/clerk-client.provider';
import { ApiKeyGuard } from 'src/Guard/api.key.guard';
import { ApiKeyService } from 'src/Service/api.key.service';
import { ApiKey } from 'src/Entities/api.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ApiKey])
  ],
  controllers: [UsersController],
  providers: [UsersService, ClerkClientProvider, ApiKeyService, ApiKeyGuard],
})
export class UsersModule { }
