//middleware
//run something before a request is handled
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
