import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as morgan from 'morgan';

function initializeSwaggerDocumentation(app: INestApplication) {
  const swaggerDocs = new DocumentBuilder()
    .setTitle('booking.back')
    .setDescription('The booking API description')
    .setVersion('1.0')
    .addTag('booking')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocs);

  writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: ['Content-Type', 'x-access-token'],
    optionsSuccessStatus: 200,
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => console.log(message.replace('\n', '')),
      },
    }),
  );

  initializeSwaggerDocumentation(app);
  await app.listen(Number(process.env.PORT));
}
bootstrap().then(() =>
  console.log(`Server started on port = ${process.env.PORT}`),
);
