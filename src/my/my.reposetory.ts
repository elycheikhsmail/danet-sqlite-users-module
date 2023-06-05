import { Inject } from 'danet/mod.ts';
import { DATABASE } from '../database/module.ts'; 

import { SqliteConfig } from '../database/sqlite.config.ts';

export class MyRepository {
  constructor(@Inject(DATABASE) private dbConfig: SqliteConfig) {
  }

  async check_if_logout(token: string): Promise<boolean> {
    const sql =
      'SELECT (token_string) from tokens WHERE token_string=:token LIMIT 1;';
    const query = this.dbConfig.client.prepareQuery<
      [string],
      never,
      { token: string }
    >(sql);
    const results = query.all({ token });
    return results.length == 1; 
  }
}
