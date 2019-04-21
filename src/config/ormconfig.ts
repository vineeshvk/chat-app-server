import { ConnectionOptions } from 'typeorm';
import Chat from '../entity/Chat';
import Message from '../entity/Message';
import User from '../entity/User';

const docker = {
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'chapDB',
};

const dev = {
  host: 'localhost',
  port: 5432,
  username: 'vineesh',
  password: '1234',
  database: 'chapDB',
};

const deploy = {
  url: process.env.DATABASE_URL,
  extra: { ssl: true },
};

const config = process.env.DATABASE_URL ? deploy : docker;

export const dbconfig: ConnectionOptions = {
  ...config,
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [Chat, User, Message],
  dropSchema: false,
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: '../entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
