import { Service } from 'src/service/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class PlannedOff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
  })
  startDate: string;

  @Column({
    type: 'timestamp',
  })
  endDate: string;

  @ManyToOne(() => Service, (service) => service.plannedOffs, {
    onDelete: 'CASCADE',
  })
  service: Service;
}
