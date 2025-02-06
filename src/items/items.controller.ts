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
import { ClerkAuthGuard } from '../users/auth/clerk-auth.guard';

@Controller('items')
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) { }

  //routes
  //get /api/users
  //get /api/users/:id
  //post /api/users
  //patch /api/users/:id
  //delete /api/users/:id
  //ban /api/users/:id

  //get /api/items
  //get /api/items/:id
  //post /api/items
  //patch /api/items/:id
  //delete /api/items/:id
  

  @Post()
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 10 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  create(
    @Body(ValidationPipe) createItemDto: CreateItemDto
  ) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiKeyRole('admin')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Get('search/:name')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  searchByName(@Param('name') name: string) {
    return this.itemsService.searchByName(name);
  }

  @Get('filter/category/:category')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  findByCategory(@Param('category') category: string) {
    return this.itemsService.findByCategory(category);
  }

  @Get('filter/ratings')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByRatings(
    @Query() query: FindByRatingsDto
  ) {
    const { ratings, name }: any = query;
    return this.itemsService.findByRatings(ratings, name);
  }

  @Patch('update/ratings/:id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 30 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  updateRatings(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.updateRatings(id, updateItemDto);
  }

  //ToDo
  // get the queries in the link
  // then use it to search the brand, special features, and other queries
  // like color, condition, fan speed (for electronics), etc

  // Generate a Shop name and a Shop ID
  // and if i search and clicked for a product
  // it will then fetch the shop ratings, ship on time, and response rate 


  //   add warranty description
  //   Return & Warranty

  // 100 % Authentic

  // Change of mind returns
  // 30 Days Free Returns
  // Warranty not available
  //also add place for the product like metro manila or overseas


  @Patch('update/:id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 5 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.update(id, updateItemDto);
  }


  @Delete('delete/:id')
  @ApiKeyRole('client')
  @Throttle({ short: { ttl: 50000, limit: 5 } })
  @UseGuards(ApiKeyGuard, ClerkAuthGuard)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
