import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Service } from '../service/service.entity';

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
}
