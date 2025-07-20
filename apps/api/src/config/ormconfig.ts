import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// Define paths for entities and migrations - use relative paths from project root
const entitiesPath = 'src/modules/shared/entities/*.entity.{ts,js}';
const migrationsPath = 'src/database/migrations/*.{ts,js}';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'booking_fincart',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  migrationsTableName: 'migrations',
  synchronize: true,
  logging: true,
});
