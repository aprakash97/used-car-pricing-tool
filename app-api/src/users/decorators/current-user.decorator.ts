import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user.entity';

interface CurrentUserRequest extends Request {
  currentUser?: User;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request: CurrentUserRequest = context.switchToHttp().getRequest();
    return request?.currentUser;
  },
);
