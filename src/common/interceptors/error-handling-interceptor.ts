import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";

// Configurando interceptorador de errors, isso é similar ao erro global que faço em Java, mapeando o nome do erro e modificando o texto de saída.
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(e => {
                return throwError(() => {
                    if (e.name === 'NotFoundException') return new BadRequestException(e.message);
                    return new BadRequestException("Ocorreu um erro desconhecido.")
                })
            }))
    }
}