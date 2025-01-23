import {
  Body, Controller,
  Delete, Get,
  Param, Patch,
  Post, Query,
  ValidationPipe, Ip,
  Req, UseGuards,
  UsePipes
} from '@nestjs/common';

import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { IsOwnerGuard } from 'src/users/auth/is-owner.guard';
import { ApiKeyRole } from 'src/Decorators/api.key.role';
import { ApiKeyGuard } from 'src/Guard/api.key.guard';
import { Throttle } from '@nestjs/throttler';
import { FindByRatingsDto } from './dto/filter/find.ratings.dto';

@Controller('items')
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 10 } })
  @UseGuards(ApiKeyGuard)
  create(
    @Body(ValidationPipe) createItemDto: CreateItemDto
  ) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiKeyRole('admin')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard)
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }



  @Get('search/:name')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard)
  searchByName(@Param('name') name: string) {
    return this.itemsService.searchByName(name);
  }

  @Get('filter/category/:category')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard)
  findByCategory(@Param('category') category: string) {
    return this.itemsService.findByCategory(category);
  }

  @Get('filter/ratings')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByRatings(
    @Query() query: FindByRatingsDto
  ) {
    const { ratings, name }: any = query;
    return this.itemsService.findByRatings(ratings, name);
  }

  @Patch('update/:id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 5 } })
  @UseGuards(ApiKeyGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.update(id, updateItemDto);
  }


  @Delete('delete/:id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 5 } })
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
