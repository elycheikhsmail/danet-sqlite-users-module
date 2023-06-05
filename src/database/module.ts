import { Module, TokenInjector } from 'danet/mod.ts';
import { SqliteConfig } from './sqlite.config.ts';
//import { PostgresService } from './postgres.service.ts';

export const DATABASE = 'DATABASE';

@Module({
  imports: [],
  injectables: [new TokenInjector(SqliteConfig, DATABASE)], // change PostgresService by any service using other database engine if needed.
})
export class DatabaseModule {}
