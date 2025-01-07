import {
IsString, IsNotEmpty,
IsEmail, IsArray,
MinLength, MaxLength,
IsEnum,
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


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    userid: string
    
    @IsString()
    @IsEnum(['customer', 'participant'], {
        message: 'Role must be either customer or participant'
    })
    role: string

    @IsArray()
    followers: Array<string>

    @IsArray()
    following: Array<string>
}