import { Request } from 'oak/mod.ts';
//
import { Inject, Injectable } from 'danet/mod.ts';
import type { RepositoryConsumerModel } from '../database/repository.ts';
import { USER_REPOSITORY } from './constant.ts';
import { get_token_from_request, verify_token } from '../users/utiles.ts';

@Injectable()
export class MyService {
  constructor(
    @Inject(USER_REPOSITORY) private repository: RepositoryConsumerModel,
  ) {
  }

  async dontAllowAnonymusWriteInDb(request: Request) {
    // even user is logout, the token may still valide dependiny on expire date
    // for this raison we still need to check if the token is in tokens table
    // if the token exist in this table that mean it is invalid.

    const token = get_token_from_request(request);
    if (token) {
      try {
        verify_token(token);
        return !await this.repository.check_if_logout(token);
      } catch (_error) {
        return false;
      }
    } else {
      return false;
    }
  }
}
