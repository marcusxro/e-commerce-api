import {
    IsString, IsNotEmpty,
    IsEmail, IsArray,
    MinLength, MaxLength,
    IsEnum,
    IsBoolean,
    IsObject,
    IsNumber,
    IsDate, 
} from "class-validator"; //class-validator class-transformer


class itemDto {
    @IsString()
    id: string;

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

class ratings {
    @IsNumber()
    average: number;

    @IsNumber()
    count: number;
}

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsBoolean()
    isFeatured: boolean;

    @IsObject()
    ratings: ratings;
    
    @IsArray()
    items: itemDto[];

    @IsArray()
    tags: string[];

    @IsNumber()
    @IsDate()
    createdAt: Date;

    
    @IsNumber()
    @IsDate()
    updatedAt: Date;
}
