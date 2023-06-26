import { BusinessAdministrator } from '../business-administrator/business-administrators.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BookableCalender } from '../bookable-calender/bookable-calender.entity';
import { ConfiguredBreak } from '../configured-break/configured-break.entity';
import { PlannedOff } from '../planned-off/planned-off.entity';
import { Appointment } from '../appointment/appointment.entity';

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
  bookableDurationInMinutes: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  breakBetweenSlotsInMinutes: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    default: process.env.DEFAULT_FUTURE_BOOKABLE_DAYS,
  })
  futureBookableDays: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    default: 1,
  })
  bookableAppointmentsPerSlotCount: number;

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
}
