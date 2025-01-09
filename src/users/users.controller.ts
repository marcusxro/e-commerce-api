import {
    Body, Controller,
    Delete, Get,
    Param, Patch,
    Post, Query,
    ParseIntPipe, ValidationPipe,
    Ip, UnauthorizedException, 
    Req
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ParseUseridPipe } from './pipes/parse-userid.pipe';
import { SkipThrottle, Throttle } from '@nestjs/throttler';


@SkipThrottle()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @SkipThrottle({ default: false })
    @Get()
    async get_all_users(
        @Ip() ip: string,
        @Query('limit') limit?: number,
        @Query('role') role?: 'customer' | 'participant'
    ) {
        return await this.usersService.get_all_users(ip, limit, role);
    }

    @Throttle({ short: { ttl: 50000, limit: 30 } })
    @Get(':userid')
    async get_user_by_id(
        @Param('userid', new ParseUseridPipe()) userid: string, 
        @Req() req: any
    ) {
        return await this.usersService.get_user_by_id(userid);
    }
    
    @Throttle({ short: { ttl: 50000, limit: 30 } })
    @Post()
    async create_user(
        @Ip() ip: string,
        @Body(ValidationPipe) user: CreateUserDto
    ) {
        const validatedUserId = new ParseUseridPipe().transform(user.userid);
        user.userid = validatedUserId;
        return await this.usersService.create_user(user);
    }
 
    @Throttle({ short: { ttl: 50000, limit: 30 } })
    @Patch('update/:userid')
    async update_user(
        @Ip() ip: string,
        @Param('userid', new ParseUseridPipe()) userid: string, 
        @Body(ValidationPipe) userUpdate: UpdateUserDto
    ) {
        return await this.usersService.update_user(ip, userid, userUpdate);
    }
    

    @Patch('add-follower/:userid')
    async add_follower(
        @Ip() ip: string,
        @Param('userid', new ParseUseridPipe()) userid: string, 
        @Query('follower', new ParseUseridPipe()) follower: string
    ) {
        return await this.usersService.add_follower(userid, follower);
    }

    @Patch('remove-follower/:userid')
    async remove_follower(
        @Ip() ip: string,
        @Param('userid', new ParseUseridPipe()) userid: string, 
        @Query('follower', new ParseUseridPipe()) follower: string
    ) {
        return await this.usersService.remove_follower(userid, follower);
    }
    

    @Delete('delete/:userid')
    async delete_user(
        @Ip() ip: string,
        @Param('userid', new ParseUseridPipe()) userid: string, 
    ) {
        return await this.usersService.delete_user(userid);
    }

}

