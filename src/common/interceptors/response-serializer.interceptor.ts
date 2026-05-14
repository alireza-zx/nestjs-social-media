import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { SERIALIZE_DTO_KEY } from "../constants/serialize-dto.constant";
import { Response } from "express";

@Injectable()
export class ResponseSerializer implements NestInterceptor {
  constructor(
    // Inject Reflector
    private readonly reflector: Reflector
  ) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const res: Response = context.switchToHttp().getResponse();
    const dto = this.reflector.getAllAndOverride(SERIALIZE_DTO_KEY, [context.getHandler(), context.getClass()]);
    if (!dto)
      return next.handle();

    return next.handle().pipe(
      map(data => {
        if (!data)
          return data;

        const serializedData = plainToInstance(dto, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        });

        const plainData = instanceToPlain(serializedData);

        return {
          status: `${res.statusCode}`.startsWith('2') ? 'succeeded' : 'failed',
          data: plainData
        }
      })
    );
  }
}