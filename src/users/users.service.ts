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
        limit: number
    ) {
        return await this.userRepository.find();
    }
    async get_user_by_id(id: number) {
        return `User with id ${id}`;
    }


    async create_user(createUserDto: CreateUserDto) {

        try {
            const existingUser = await this.userRepository.findOne({ where: { fullname: createUserDto.fullname } });

            if (existingUser) {
                return 'User already exists';
            }

            const newUser = this.userRepository.create(createUserDto);
            await this.userRepository.save(newUser);
            return { message: "User created successfully", user: newUser };
        }
        catch (err: any) {
            if (err.code === '23505') {
                // Handle unique constraint violation
                throw new BadRequestException(
                  'A user with the same userid already exists. Please use a different userid.',
                );
              }
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
