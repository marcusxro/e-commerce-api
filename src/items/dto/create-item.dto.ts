import { Type } from "class-transformer";
import {
    IsString, IsNotEmpty,
    IsEmail, IsArray,
    MinLength, MaxLength,
    IsEnum,
    IsBoolean,
    IsObject,
    IsNumber,
    IsDate,
    ValidateNested,
    Min,
} from "class-validator"; //class-validator class-transformer


class itemDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsArray()
    images: string[];

    @IsNumber()
    sold: number;
}

class RatingsDto {
    @IsNumber()
    average: number;

    @IsNumber()
    count: number;
}

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    itemId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(40)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
    description: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsBoolean()
    isFeatured: boolean;

    @IsObject()
    @ValidateNested()
    @Type(() => RatingsDto)
    ratings: RatingsDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => itemDto)
    items: itemDto[];

    @IsArray()
    tags: string[];

    @IsDate()
    @Type(() => Date) // Transform string to Date
    createdAt: Date;

    @IsDate()
    @Type(() => Date) // Transform string to Date
    updatedAt: Date;
}
