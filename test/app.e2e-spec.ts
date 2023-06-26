import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { TestManager } from './helpers/test-manager.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const testManager: TestManager = await global.testManager.initApp();

    app = testManager.getApp();

    dataSource = testManager.getDataSource();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
    expect(true).toBeTruthy();
  });
});
