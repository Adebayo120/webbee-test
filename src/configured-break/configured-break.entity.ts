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
export class ConfiguredBreak {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  start_hour_in_minutes: number;

  @Column({
    type: 'int',
    unsigned: true,
  })
  end_hour_in_minutes: number;

  @ManyToOne(() => Service, (service) => service.configuredBreaks, {
    onDelete: 'CASCADE',
  })
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
