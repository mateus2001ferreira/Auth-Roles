import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();

  SwaggerModule.setup(
    'api/swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Autenticação')
        .setDescription('Backend de Autenticação')
        .setVersion('1.0')
        .build(),
    ),
  );

  await app.listen(Number(process.env.APP_PORT), () =>
    app.getUrl().then((url) => console.log(`Server running on: ${url}.`)),
  );
}
bootstrap();
