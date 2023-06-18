import { Service } from 'src/service/service.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class PlannedOff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
  })
  end_date: Date;

  @ManyToOne(() => Service, (service) => service.plannedOffs)
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
