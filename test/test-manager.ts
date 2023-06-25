import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

export class TestManager {
  app: INestApplication<any>;
  dataSource: DataSource;

  async initApp(config: ModuleMetadata): Promise<this> {
    const moduleFixture: TestingModule = await Test.createTestingModule(
      config,
    ).compile();

    this.app = moduleFixture.createNestApplication();

    this.dataSource = this.app.get<DataSource>(DataSource);

    await this.dataSource.runMigrations();

    await this.app.init();

    return this;
  }

  getApp(): INestApplication<any> {
    return this.app;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async afterEach() {
    await this.dataSource.dropDatabase();

    await this.app.close();
  }
}
