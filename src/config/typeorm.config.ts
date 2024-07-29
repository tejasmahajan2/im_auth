import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  autoLoadEntities: true,
  synchronize: true,
};
