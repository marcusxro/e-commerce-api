import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]) 
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
