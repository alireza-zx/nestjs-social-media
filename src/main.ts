import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

process.env.UV_THREADPOOL_SIZE = '6';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set global prefix
  app.setGlobalPrefix('/api');
  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    transform: true
  }));

  // cors
  app.enableCors();
  // helmet
  app.use(helmet())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();