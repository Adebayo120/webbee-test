import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Service } from 'src/service/service.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({
    type: 'timestamp',
  })
  startDate: string;

  @Field()
  @Column({
    type: 'timestamp',
  })
  endDate: string;

  @ManyToOne(() => Service, (service) => service.appointments, {
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
