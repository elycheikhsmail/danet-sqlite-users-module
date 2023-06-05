import { DB } from 'sqlite/mod.ts';

import { Injectable } from 'danet/mod.ts';
import { OnAppBootstrap, OnAppClose } from 'danet/src/hook/interfaces.ts';

@Injectable()
export class SqliteConfig implements OnAppBootstrap, OnAppClose {
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
