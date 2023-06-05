import { AuthGuard, ExecutionContext, Injectable } from 'danet/mod.ts';
import { get_token_from_request, verify_token } from '../users/utiles.ts';
import { Request } from 'oak/mod.ts';

@Injectable()
export class ReadAuthGuard implements AuthGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.request;
    return validateRequest(request);
  }
}

function validateRequest(request: Request): boolean {
  const token = get_token_from_request(request);
  if (token) {
    try {
      verify_token(token);
      return true;
    } catch (_error) {
      return false;
    }
  } else {
    return false;
  }
}
