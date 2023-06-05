import { RepositoryUserModel } from '../database/repository.ts';
import { User } from './users.class.ts';
import { Inject } from 'danet/mod.ts';
import { DATABASE } from '../database/module.ts';
import { SqliteConfig } from '../database/sqlite.config.ts';

export class UserRepository implements RepositoryUserModel<User> {
  constructor(@Inject(DATABASE) private dbConfig: SqliteConfig) {
  }
  //constructor(@Inject(DATABASE) private dbConfig: PostgresService) {
  //}
  async create(user: Omit<User, '_id'>) {
    const uuid = crypto.randomUUID();
    const sql =
      'INSERT INTO users (_id, email, password) VALUES ( :uuid, :email, :password) '; // RETURNING _id, email, password;
    const query = this.dbConfig.client.prepareQuery<
      never,
      never,
      { uuid: string; email: string; password: string }
    >(sql);
    query.execute({ uuid, email: user.email, password: user.password });

    return user;
  }

  async checkUser(user: Omit<User, '_id'>) {
    const sql =
      `SELECT  email, password FROM users  WHERE email= :email AND password=:password;`;
    const query = this.dbConfig.client.prepareQuery<
      [string, string],
      { email: string; password: string },
      { email: string; password: string }
    >(sql);
    const _rows = query.allEntries({
      email: user.email,
      password: user.password,
    });
    const user1 = new User(user.email, user.password);
    return user1;
  }

  async logout(token: string): Promise<void> {
    const uuid = crypto.randomUUID();
    const sql =
      'INSERT INTO tokens (_id,token_string) VALUES ( :uuid, :token ) ';
    // RETURNING _id, email, password;
    const query = this.dbConfig.client.prepareQuery<
      never,
      never,
      { uuid: string; token: string }
    >(sql);
    query.execute({ uuid, token });
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
