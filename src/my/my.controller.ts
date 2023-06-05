import { Controller, Get, Req, UseGuard } from 'danet/mod.ts';
import { MyService } from './my.service.ts';
import { ReadAuthGuard } from './my.read.guard.ts';
import { Request } from 'oak/mod.ts';
import { ApiBearerAuth, Tag } from 'danet_swagger/decorators.ts';

@ApiBearerAuth()
@Tag('my')
@Controller('my')
export class MyController {
  constructor(public myService: MyService) {
  }

  @Get('read')
  @UseGuard(ReadAuthGuard)
  async protected_for_read() {
    // assuming data come from db
    return { msg: 'ok' };
  }

  @Get('write')
  async protected_for_write(@Req() req: Request) {
    // assuming write data in  db
    const can_I_write_in_db = await this.myService.dontAllowAnonymusWriteInDb(
      req,
    );
    const resp = can_I_write_in_db
      ? { msg: 'ok, you can write in db' }
      : { msg: 'no, you can\'t write in db' };
    return resp;
  }
}
