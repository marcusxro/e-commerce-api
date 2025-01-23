import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindByRatingsDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value)) // Transform string to number
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'ratings must be a number with at most 1 decimal place' }) // Optional decimal place restriction
  @Min(0.1)
  @Max(5)
  ratings: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  name: string;
}
