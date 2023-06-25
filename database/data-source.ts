import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env',
});

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [configService.get('DB_ENTITIES_PATH')],
  migrations: [configService.get('DB_MIGRATION_PATH')],
  seeds: [configService.get('DB_SEEDS_PATH') as string],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
