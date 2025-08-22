import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseIntIdPipe } from './common/pipes/parse-int-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove chaves que não estão no meu DTO
    forbidNonWhitelisted: true, // Levantar erro quando a chave enviada no JSON não existir.
    // transform: true, // Tenta transformar os tipos de dados de param e dtos
  }),
    new parseIntIdPipe(),
  ); // Validador

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
