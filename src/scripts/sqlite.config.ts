import { DB } from 'sqlite/mod.ts';

export class SqliteConfig {
  constructor() {
    console.log('new sqlite was created');
  }

  public client!: DB;

  async onAppBootstrap() {
    this.client = new DB('test.db');
  }

  async onAppClose() {
    await this.client.close();
  }
}
