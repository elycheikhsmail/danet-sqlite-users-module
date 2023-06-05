import { DbConfig } from './db-config.ts';

export class InitDbService extends DbConfig {
  constructor() {
    super();
  }

  async createTable() {
    await this.onAppBootstrap();
    await this.client.queryObject(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS users (
        _id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT,
        password TEXT
      );`,
    );
    // token_string  should be unique
    await this.client.queryObject(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS tokens (
        _id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        token_string TEXT
      );`,
    );

    await this.onAppClose();
    console.log('task done');
  }
}
