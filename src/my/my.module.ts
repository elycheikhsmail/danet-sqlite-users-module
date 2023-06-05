import { MyController } from './my.controller.ts';
import { Module, TokenInjector } from 'danet/mod.ts';
import { MyRepository } from './my.reposetory.ts';
import { USER_REPOSITORY } from './constant.ts';
import { MyService } from './my.service.ts';

@Module({
  controllers: [MyController],
  injectables: [
    new TokenInjector(MyRepository, USER_REPOSITORY),
    MyService,
  ],  
})
export class MyModule {}
