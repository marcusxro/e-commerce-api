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
    // @Inject('ClerkClient') private readonly clerkClient: ClerkClient, // Inject ClerkClient here later for production
  ) { }

  async create(createItemDto: CreateItemDto) {
    try {

      const existingItem = await this.itemsRepository.findOne({ where: { itemId: createItemDto.itemId } });

      if (existingItem) {
        throw new BadRequestException('Item already exists');
      }
      const item = this.itemsRepository.create(createItemDto);

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

  async findByCategory(category: string) {
    const foundItems = await this.itemsRepository.find({ where: { category: category } });

    if (!foundItems) {
      throw new BadRequestException('Items not found');
    }

    if (foundItems.length === 0 && foundItems) {
      throw new BadRequestException('No items available in this category');
    }

    return {
      message: 'Items found',
      items: foundItems,
    };
  }


  async searchByName(name: string) {
    const foundItems = await this.itemsRepository
      .createQueryBuilder('item')
      .where('item.name ILIKE :name', { name: `%${name}%` }) // ILIKE case-insensitive
      .getMany();

    if (foundItems.length === 0) {
      throw new BadRequestException('No items available with this name');
    }

    return {
      message: 'Items found',
      items: foundItems,
    };
  }


  async findByRatings(rating: number, name: string) {
    console.log(typeof rating)
    const foundItems = await this.itemsRepository
      .createQueryBuilder('item')
      .where('item.name ILIKE :name', { name: `%${name}%` }) // Case-insensitive search for name
      .andWhere('item.ratings ->> \'average\' = :rating', { rating: rating }) // Querying nested JSON
      .getMany();



    if (foundItems.length === 0) {
      const relevantItems = await this.itemsRepository
        .createQueryBuilder('item')
        .where('item.name ILIKE :name', { name: `%${name}%` })
        .orWhere('CAST(item.ratings ->> \'average\' AS FLOAT) BETWEEN :low AND :high', { low: rating - 1, high: rating + 1 })
        .getMany();
    
      return {
        message: 'No items found matching the criteria, returned relevant results',
        items: relevantItems,
      };
    }
    
    return {
      message: 'Items found',
      items: foundItems,
    };
  }


  async findOne(id: string) {
    const foundItem = await this.itemsRepository.findOne({ where: { itemId: id } });

    if (!foundItem) {
      throw new BadRequestException('Item not found');
    }

    return {
      message: 'Item found',
      item: foundItem,
    };
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto
  ) {
    try {

      const item = await this.itemsRepository.findOne({ where: { itemId: id } });

      if (!item) {
        throw new BadRequestException('Item not found');
      }

      const updatedDate: Date = new Date();

      updateItemDto.updatedAt = updatedDate

      const updatedItem = Object.assign(item, updateItemDto);

      await this.itemsRepository.save(updatedItem);

      return { message: 'Item updated successfully', item: updatedItem };
    }
    catch (error) {
      console.error('Error in updating item:', error);
      throw new BadRequestException(error);
    }
  }

  async updateRatings(
    id: string,
    updateItemDto: UpdateItemDto
  ) {
    try {
      const item = await this.itemsRepository.findOne({ where: { itemId: id } });

      if (!item) {
        throw new BadRequestException('Item not found');
      }

      const updatedDate: Date = new Date();

      updateItemDto.updatedAt = updatedDate

      const updatedItem = Object.assign(item, updateItemDto);

      await this.itemsRepository.save(updatedItem);

      return { message: 'Item ratings updated successfully', item: updatedItem };
    }
    catch (error) {
      console.error('Error in updating item ratings:', error);
      throw new BadRequestException(error);
    }
  }


  async remove(id: string) {
    try {
      const item = await this.itemsRepository.findOne({ where: { itemId: id } });

      const isOwner = await this.itemsRepository.findOne({ where: { itemId: id } });

      if(!isOwner) {
        throw new BadRequestException('You are not the owner of this item');
      }

      if (!item) {
        throw new BadRequestException('Item not found');
      }
      await this.itemsRepository.remove(item);
      return { message: 'Item deleted successfully' };
    }
    catch (error) {
      console.error('Error in deleting item:', error);
      throw new BadRequestException(error);
    }
  }
}
