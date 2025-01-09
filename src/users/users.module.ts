import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClerkClientProvider } from './helpers/clerk-client.provider';

@Module({
  imports: [ TypeOrmModule.forFeature([UserEntity]) ],
  controllers: [UsersController],
  providers: [UsersService, ClerkClientProvider],
})
export class UsersModule {}
