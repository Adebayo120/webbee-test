import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { BusinessAdministratorModule } from './modules/business-administrator/business-administrator.module';
import { dataSourceOptions } from './../database/data-source';
import { ServiceModule } from './modules/service/service.module';
import { BookableCalenderModule } from './modules/bookable-calender/bookable-calender.module';
import { ConfiguredBreakModule } from './modules/configured-break/configured-break.module';
import { PlannedOffModule } from './modules/planned-off/planned-off.module';
import { SlotModule } from './modules/slot/slot.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelpersModule } from './helpers/helpers.module';
import { ValidatorsModule } from './validators/validators.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ConfigModule } from '@nestjs/config';
import { FactoriesModule } from './factories/factories.module';

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
    FactoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
