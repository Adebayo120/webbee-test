import { Service } from '../service/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class BusinessAdministrator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Service, (Service) => Service.businessAdministrator)
  services: Service[];
}
