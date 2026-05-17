import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/users/user.entity';

interface CurrentUserRequest extends Request {
  currentUser?: User;
}

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: CurrentUserRequest = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      console.log('no current user initialized yer');
      return false;
    }

    return request.currentUser.admin;
  }
}
