import Config from 'src/config';
import { BusinessAdministrator } from './../business_administrator/business_administrators.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BookableCalender } from 'src/bookable_calender/bookable_calender.entity';
import { ConfiguredBreak } from 'src/configured_break/configured_breaks.entity';
import { PlannedOff } from 'src/planned_off/planned_off.entity';
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
  )
  businessAdministrator: BusinessAdministrator;

  @Column({
    type: 'int',
    unique: true,
  })
  bookable_duration_in_minutes: Number;

  @Column({
    type: 'int',
    unique: true,
    default: 0,
  })
  break_between_slots_in_minutes: Number;

  @Column({
    type: 'bigint',
    unique: true,
    default: Config.DEFAULT_FUTURE_BOOKABLE_DAYS,
  })
  future_bookable_days: String;

  @Column({
    type: 'bigint',
    unique: true,
    default: 1,
  })
  bookable_appointments_per_slot_count: String;

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
