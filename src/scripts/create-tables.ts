import { configAsync } from 'dotenv/mod.ts';
import { InitDbService } from './init-db.service.ts';
await configAsync({ export: true });

const initDb = new InitDbService();
initDb.createTable();
