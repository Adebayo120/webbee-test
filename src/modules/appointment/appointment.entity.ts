import { Field, ObjectType } from '@nestjs/graphql';
import { Service } from '../service/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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
}
