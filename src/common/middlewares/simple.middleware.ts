import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

// A função do middleware é executar algo antes e depois do NESTJS, que usa a requisição / resposta.
export class SimpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        return res.status(404).send({
            message: "Não encontrado.."
        })
    }
}