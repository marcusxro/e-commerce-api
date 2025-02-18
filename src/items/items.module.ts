import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { ApiKeyGuard } from 'src/Guard/api.key.guard';
import { ApiKey } from 'src/Entities/api.entity';
import { ApiKeyService } from 'src/Service/api.key.service';
import { ClerkClientProvider } from 'src/users/helpers/clerk-client.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    TypeOrmModule.forFeature([ApiKey])
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ClerkClientProvider,  ApiKeyService, ApiKeyGuard],
})
export class ItemsModule {}
