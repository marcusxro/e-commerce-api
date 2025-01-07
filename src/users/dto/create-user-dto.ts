import {
IsString, IsNotEmpty,
IsEmail, IsArray,
MinLength, MaxLength,
} from "class-validator"; //class-validator class-transformer


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    fullname: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MinLength(10)
    @MaxLength(50)
    email: string
    
    @IsArray()
    role: Array<string>

    @IsArray()
    followers: Array<string>

    @IsArray()
    following: Array<string>
}