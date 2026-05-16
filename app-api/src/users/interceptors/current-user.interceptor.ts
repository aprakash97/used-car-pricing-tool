import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface CurrentUserRequest extends Request {
  currentUser?: any;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request: CurrentUserRequest = context.switchToHttp().getRequest();

    const { userId } = request.session as { userId?: string };

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
