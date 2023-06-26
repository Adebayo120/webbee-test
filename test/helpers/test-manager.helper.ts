import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { runSeeder } from 'typeorm-extension';
import DatabaseSeeder from '../../database/seeders/database.seeder';
import { Service } from '../../src/service/service.entity';
import { AppModule } from '../../src/app.module';

export class TestManager {
  app: INestApplication<any>;
  dataSource: DataSource;
  serviceId: number;

  async initApp(): Promise<this> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();

    useContainer(this.app.select(AppModule), { fallbackOnErrors: true });

    this.app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

    this.dataSource = this.app.get<DataSource>(DataSource);

    await this.dataSource.runMigrations();

    await runSeeder(this.dataSource, DatabaseSeeder);

    await this.setServiceId();

    await this.app.init();

    return this;
  }

  getApp(): INestApplication<any> {
    return this.app;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async afterAll() {
    await this.dataSource.dropDatabase();

    await this.app.close();
  }

  async setServiceId() {
    const services = await this.dataSource.getRepository(Service).find();

    this.serviceId = services[0].id;
  }

  getServiceId(): number {
    return this.serviceId;
  }
}
