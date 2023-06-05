import { UserController } from './users.controller.ts';
import { Module, TokenInjector } from 'danet/mod.ts';
import { UserRepository } from './users.reposetory.ts';
import { USER_REPOSITORY } from './constant.ts';
import { UserService } from './users.service.ts';

@Module({
  controllers: [UserController],
  injectables: [
    new TokenInjector(UserRepository, USER_REPOSITORY),
    UserService,
  ],
})
export class UserModule {}
