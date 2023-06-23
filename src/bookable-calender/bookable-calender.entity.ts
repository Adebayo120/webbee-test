import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Service } from 'src/service/service.entity';

@Entity()
export class BookableCalender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    unsigned: true,
  })
  day: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  openingHourInMinutes: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  closingHourInMinutes: number;

  @Column({
    type: 'bool',
    default: true,
  })
  available: boolean;

  @ManyToOne(() => Service, (service) => service.bookableCalenders, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
