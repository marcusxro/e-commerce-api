import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';


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
@Unique(["itemId"])  // Add this decorator to enforce unique constraint
export class ItemEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    itemId: string;
  
    @Column()
    userId: string;
  
    @Column()
    name: string;
    @Column()
    description: string;
  
    @Column()
    category: string;
  
    @Column()
    isFeatured: boolean;
  
    @Column({ type: 'json', nullable: true })
    ratings: { average: number; count: number }; 
  
    @Column({ type: 'json', nullable: true })
    items: Item[]; 
  
    @Column({ type: 'simple-array', nullable: true })
    tags: string[];
  
    @Column()
    createdAt: Date;
  
    @Column()
    updatedAt: Date;
  }