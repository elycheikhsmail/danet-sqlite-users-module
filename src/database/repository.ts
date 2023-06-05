//import { Request } from 'oak/mod.ts';

export interface Repository<T extends unknown> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  // deno-lint-ignore no-explicit-any
  create(dto: unknown): Promise<any>;
  updateOne(id: string, dto: T): Promise<unknown>;
  deleteOne(id: string): Promise<unknown>;
  deleteAll(): Promise<unknown>;
}

export interface RepositoryUserModel<T extends unknown> {
  // deno-lint-ignore no-explicit-any
  create(dto: unknown): Promise<any>;
  checkUser(dto: unknown): Promise<T | undefined>;
  logout(token: string): Promise<void>;
  check_if_logout(token: string): Promise<boolean>;
}

export interface RepositoryConsumerModel {
  check_if_logout(token: string): Promise<boolean>;
  //dontAllowAnonymusWriteInDb(request: Request): Promise<boolean>;
}
