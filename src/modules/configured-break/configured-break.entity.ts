import { Service } from '../service/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ConfiguredBreak {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  startHourInMinutes: number;

  @Column({
    type: 'int',
    unsigned: true,
  })
  endHourInMinutes: number;

  @ManyToOne(() => Service, (service) => service.configuredBreaks, {
    onDelete: 'CASCADE',
  })
  service: Service;
}
