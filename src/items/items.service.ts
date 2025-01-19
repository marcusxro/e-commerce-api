import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClerkClient } from '@clerk/clerk-sdk-node';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemsRepository: Repository<ItemEntity>,
    // @Inject('ClerkClient') private readonly clerkClient: ClerkClient, // Inject ClerkClient here

  ) { }

  async create(createItemDto: CreateItemDto) {
    try {
      // Ensure that you're not manually stringifying objects
     const existingItem = await this.itemsRepository.findOne({ where: { itemId: createItemDto.itemId } });


      if (existingItem) {
        throw new BadRequestException('Item already exists');
      }

      // Create the new item instance directly from the DTO
      const item = this.itemsRepository.create(createItemDto);

      // Save the item to the database
      await this.itemsRepository.insert(item);

      return { message: 'Item created successfully', item };
    } catch (error) {
      console.error('Error in creating item:', error);
      throw new Error(error.message);
    }
  }

  async findAll() {
    const items = await this.itemsRepository.find();

    // Use plainToClass to transform plain objects into instances of the ItemEntity class
    const transformedItems = plainToClass(ItemEntity, items);

    return {
      message: 'Items found',
      items: transformedItems,
    };
  }

  async findOne(id: string) {
    // Fetch item by itemId
    const foundItem = await this.itemsRepository.findOne({ where: { itemId: id } });

    // If no item found, throw a BadRequestException
    if (!foundItem) {
      throw new BadRequestException('Item not found');
    }

    // Return the found item in a structured response
    return {
      message: 'Item found',
      item: foundItem,
    };
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
