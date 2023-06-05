import jwt from 'npm:jsonwebtoken';
import { Request } from 'oak/mod.ts';
//
import { Inject, Injectable } from 'danet/mod.ts';
import type { RepositoryUserModel } from '../database/repository.ts';
import { USER_REPOSITORY } from './constant.ts';
import { User } from './users.class.ts';
import { get_token_from_request, verify_token } from './utiles.ts';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private repository: RepositoryUserModel<User>,
  ) {
  }

  async create(user: Omit<User, '_id'>) {
    return this.repository.create(user);
  }

  async checkUser(user: Omit<User, '_id'>) {
    console.log('start checkUser');
    const userOutput = await this.repository.checkUser(user);
    console.log(userOutput?.email);
    if (userOutput) {
      //

      const payload = {
        userId: userOutput._id,
        userEmail: user.email,
        role: 'admin',
      };

      const SECKRET_KEY = Deno.env.get('SECKRET_KEY');

      const token = jwt.sign(payload, SECKRET_KEY);
      console.log('token : ');
      console.log(token);
      return { token };
    } else {
      return null;
    }
  }

  async logoutUser(request: Request) {
    const token = get_token_from_request(request);
    if (token) {
      try {
        verify_token(token);
        // save this token in db
        await this.repository.logout(token);
        return true;
      } catch (_error) {
        return false;
      }
    } else {
      return false;
    }
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
