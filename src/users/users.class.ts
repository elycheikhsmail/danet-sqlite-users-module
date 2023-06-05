import { IsString } from 'danet/validation.ts';

export class User {
  readonly _id = crypto.randomUUID();
  @IsString()
  public email: string;

  @IsString()
  public password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
