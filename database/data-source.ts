import Config from 'src/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
