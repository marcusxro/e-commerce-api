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
import { ApiKeyRole } from 'src/Decorators/api.key.role';
import { ApiKeyGuard } from 'src/Guard/api.key.guard';

@Controller('items')
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  @ApiKeyRole('client')  // Only 'client' can access this route
  @UseGuards(ApiKeyGuard)  // Apply the guard
  create(
    @Body(ValidationPipe) createItemDto: CreateItemDto
  ) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiKeyRole('admin')  // Only 'admin' can access this route
  @UseGuards(ApiKeyGuard)  // Apply the guard
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiKeyRole('client')  // Only 'client' can access this route
  @UseGuards(ApiKeyGuard)  // Apply the guard
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch('update/:id')
  @ApiKeyRole('client')  // Only 'client' can access this route
  @UseGuards(ApiKeyGuard)  // Apply the guard
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.update(id, updateItemDto);
  }


  @Delete('delete/:id')
  @ApiKeyRole('client')  // Only 'client' can access this route
  @UseGuards(ApiKeyGuard)  // Apply the guard
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
