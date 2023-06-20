import Config from 'src/config';
import { BusinessAdministrator } from '../business-administrator/business-administrators.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { ConfiguredBreak } from 'src/configured-break/configured-break.entity';
import { PlannedOff } from 'src/planned-off/planned-off.entity';
import { Appointment } from 'src/appointment/appointment.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    () => BusinessAdministrator,
    (businessAdministrator) => businessAdministrator.services,
    {
      onDelete: 'CASCADE',
    },
  )
  businessAdministrator: BusinessAdministrator;

  @Column({
    type: 'int',
    unsigned: true,
  })
  bookable_duration_in_minutes: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  break_between_slots_in_minutes: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    default: Config.DEFAULT_FUTURE_BOOKABLE_DAYS,
  })
  future_bookable_days: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    default: 1,
  })
  bookable_appointments_per_slot_count: number;

  @OneToMany(
    () => BookableCalender,
    (bookableCalender) => bookableCalender.service,
  )
  bookableCalenders: BookableCalender[];

  @OneToMany(
    () => ConfiguredBreak,
    (configuredBreak) => configuredBreak.service,
  )
  configuredBreaks: ConfiguredBreak[];

  @OneToMany(() => PlannedOff, (plannedOff) => plannedOff.service)
  plannedOffs: PlannedOff[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

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
