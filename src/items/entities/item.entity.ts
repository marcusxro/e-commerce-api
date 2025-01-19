import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column({ type: 'simple-array' })
    images: string[];

    @Column()
    sold: number;
}


class Ratings {
    @Column({ type: 'float' })
    average: number;
  
    @Column({ type: 'int' })
    count: number;
  }

@Entity({ name: 'items' })
export class ItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    isFeatured: boolean;

    @Column({ type: 'simple-json' })
    ratings: Ratings;

    @Column({ type: 'simple-array' })
    items: Item[];

    @Column({ type: 'simple-array' })
    tags: string[];

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}