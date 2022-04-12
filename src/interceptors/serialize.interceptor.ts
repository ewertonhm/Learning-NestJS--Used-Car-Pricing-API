import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from "class-transformer";

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled
        // by the request handler
        //console.log('run before rangler', context)

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            }
        ))        
    }
} 