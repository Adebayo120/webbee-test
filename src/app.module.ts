import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { BusinessAdministratorModule } from './business-administrator/business-administrator.module';
import { dataSourceOptions } from 'database/data-source';
import { ServiceModule } from './service/service.module';
import { BookableCalenderModule } from './bookable-calender/bookable-calender.module';
import { ConfiguredBreakModule } from './configured-break/configured-break.module';
import { PlannedOffModule } from './planned-off/planned-off.module';
import { SlotModule } from './slot/slot.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelpersModule } from './helpers/helpers.module';
import { ValidatorsModule } from './validators/validators.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    BusinessAdministratorModule,
    ServiceModule,
    BookableCalenderModule,
    ConfiguredBreakModule,
    PlannedOffModule,
    AppointmentModule,
    SlotModule,
    HelpersModule,
    ValidatorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
