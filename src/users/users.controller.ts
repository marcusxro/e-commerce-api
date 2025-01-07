import {
    Body, Controller,
    Delete, Get,
    Param, Patch,
    Post, Query,
    ParseIntPipe, ValidationPipe,
    Ip
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ParseUseridPipe } from './pipes/parse-userid.pipe';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }



    @Get()
    async get_all_users(
        @Ip() ip: string,
        @Query('limit') limit?: number,
        @Query('role') role?: 'customer' | 'participant'
    ) {

        return await this.usersService.get_all_users(ip, limit, role);
    }

    @Get(':id')
    async get_user_by_id(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.get_user_by_id(id);
    }


    @Post()
    async create_user(
        @Ip() ip: string,
        @Body(ValidationPipe) user: CreateUserDto
    ) {
        return await this.usersService.create_user(user);
    }


    @Patch('update/:userid')
    async update_user(
        @Ip() ip: string,
        @Param('userid', new ParseUseridPipe()) userid: string, 
        @Body(ValidationPipe) userUpdate: UpdateUserDto
    ) {
        console.log('User Update:', userid);
        return await this.usersService.update_user(ip, userid, userUpdate);
    }
    


    @Delete(':id')
    async delete_user(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.delete_user(id);
    }

}

