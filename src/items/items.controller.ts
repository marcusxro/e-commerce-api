import {
  Body, Controller,
  Delete, Get,
  Param, Patch,
  Post, Query,
  ValidationPipe, Ip,
  Req, UseGuards
} from '@nestjs/common';

import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { IsOwnerGuard } from 'src/users/auth/is-owner.guard';

@Controller('items')
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  create(
    @Body(ValidationPipe) createItemDto: CreateItemDto
  ) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.update(id, updateItemDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
