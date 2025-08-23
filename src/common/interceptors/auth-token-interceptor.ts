import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.slip(' ')[1];

        // CHECAR TOKEN 
        if (!token) throw new UnauthorizedException("Usuário nã logado.")

        return next.handle();
    }
}