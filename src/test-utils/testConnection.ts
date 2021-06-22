import { postgresPass } from '../../config';
import { createConnection } from 'typeorm';

export const testConnection = (drop: boolean = false) => {
  return createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'forestwhale',
    password: postgresPass,
    database: 'graphqlserver-test',
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + '/../entity/*.*'],
  });
};
