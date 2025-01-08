import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

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

    async get_user_by_id(
        userid: string
    ) {

        const user = await this.userRepository.findOne({ where: { userid: userid } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return { message: "User fetched successfully", user: user };
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


    async update_user(
        ip: string,
        userid: string,
        userUpdateDto: UpdateUserDto
    ) {
        const user = await this.userRepository.findOne({ where: { userid: userid } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Check if 'userid' is being updated
        if (userUpdateDto.userid) {
            throw new BadRequestException('The userid cannot be updated');
        }

        // If 'userid' is not part of the update, proceed to update the user
        const updatedUser = Object.assign(user, userUpdateDto);
        await this.userRepository.save(updatedUser);

        return { message: "User updated successfully", user: updatedUser };
    }


    async add_follower
        (
            userid: string,
            follower: string
        ) {
        const user = await this.userRepository.findOne({ where: { userid: userid } });

        if (follower === userid) {
            throw new BadRequestException('User cannot follow themselves');
        }

        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (!follower) {
            throw new BadRequestException('Follower not found');
        }

        const isFollower = user.followers.find(f => f === follower);

        if (isFollower) {
            throw new BadRequestException('Follower already exists');
        }

        const userFollowers = user.followers;
        userFollowers.push(follower);

        const updatedUser = await this.userRepository.save(user);
        return { message: "Follower added successfully", user: updatedUser };
    }


    async remove_follower
    (
        userid: string,
        follower: string
    ) {
        const user = await this.userRepository.findOne({ where: { userid: userid } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (!follower) {
            throw new BadRequestException('Follower not found');
        }

        const isFollower = user.followers.find(f => f === follower);

        if (!isFollower) {
            throw new BadRequestException('Follower does not exist');
        }

        const userFollowers = user.followers.filter(f => f !== follower);

        user.followers = userFollowers;
        const updatedUser = await this.userRepository.save(user);
        return { message: "Follower removed successfully", user: updatedUser };
    }


    async delete_user(
        userid: string
    ) {
        const foundUser = await this.userRepository.findOne({ where: { userid: userid } });

        if (!foundUser) {
            throw new BadRequestException('User not found');
        }

        const deletedUser = await this.userRepository.delete({ userid: userid });

        if (deletedUser.affected === 0) {
            throw new NotFoundException(`User with userid ${userid} not found`);
        }

        return {
            message: "User deleted successfully",
            status: "success",
            deletedUser: foundUser
        };
    }

}
