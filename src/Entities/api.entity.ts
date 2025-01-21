import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'text'})
  role: string; // 'client', 'admin', etc
}
