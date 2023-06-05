//import { InitDbService } from './init-db.service.ts';
import { InitDbService } from './init-sqlite.service.ts';

const initDb = new InitDbService();
initDb.createTable();
