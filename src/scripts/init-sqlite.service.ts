import { DbConfig } from './db-config.ts';
import { SqliteConfig } from './sqlite.config.ts';

export class InitDbService extends SqliteConfig {
  constructor() {
    super();
  }

  async createTable() {
    await this.onAppBootstrap();
    await this.client.execute(
      `CREATE TABLE IF NOT EXISTS users (
            _id TEXT PRIMARY KEY,
            email TEXT,
            password TEXT
            );
          `,
    );
    // token_string  should be unique
    await this.client.execute(
      `CREATE TABLE IF NOT EXISTS tokens (
        _id TEXT  PRIMARY KEY,
        token_string TEXT
      );`,
    );

    await this.onAppClose();
    console.log('task done');
  }
}
