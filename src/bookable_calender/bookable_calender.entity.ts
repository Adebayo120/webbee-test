import Config from 'src/config';
import { BusinessAdministrator } from '../business_administrator/business_administrators.entity';
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
    unique: true,
  })
  day: Number;

  @Column({
    type: 'int',
    unique: true,
    nullable: true,
  })
  opening_hour_in_minutes: Number;

  @Column({
    type: 'int',
    unique: true,
    nullable: true,
  })
  closing_hour_in_minutes: Number;

  @Column({
    type: 'bool',
    default: true,
  })
  available: Boolean;

  @ManyToOne(() => Service, (service) => service.bookableCalenders)
  service: Service;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
