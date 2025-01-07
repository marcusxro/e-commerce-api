import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    email: string;

    @Column()
    role: string;

    @Column({ unique: true })
    userid: string;

    @Column({ type: 'simple-array' })
    followers: string[];
  
    @Column({ type: 'simple-array' })
    following: string[];
}