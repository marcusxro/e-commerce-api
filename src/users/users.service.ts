import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }


    async get_all_users(
        ip: string,
        limit: number,
        role: 'customer' | 'participant'
    ) {
        console.log('Limit:', limit);
        console.log('Role:', role);

        const users = await this.userRepository.find({
            where: { role: role },
            take: limit,
        });

        if (role) {
            if (role !== 'customer' && role !== 'participant') {
                throw new BadRequestException('Invalid role specified. Allowed roles are "customer" or "participant".');
            }
        }

        if (users.length < limit) {
            throw new BadRequestException('The number of users returned is less than the limit specified.');
        }

        return { message: "Users fetched successfully", size: users.length, users: users };
    }

    async get_user_by_id(id: number) {
        return `User with id ${id}`;
    }


    async create_user(createUserDto: CreateUserDto) {

        try {
            const existingUser = await
                this.userRepository.findOne({ where: { userid: createUserDto.userid } });

            if (existingUser) {
                return new BadRequestException('A user with the same userid already exists. Please use a different account.');
            }

            const newUser = this.userRepository.create(createUserDto);
            await this.userRepository.save(newUser);
            return { message: "User created successfully", user: newUser };
        }
        catch (err: any) {

            throw new InternalServerErrorException();
        }
    }


    async update_user(id: number, body) {
        return `User with id ${id} updated`;
    }

    async delete_user(id: number) {
        return `User with id ${id} deleted`;
    }
}
