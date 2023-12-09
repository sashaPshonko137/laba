import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const documentConfig = new DocumentBuilder()
    .setTitle('Laba api ')
    .setVersion('alpha')
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, documentConfig),
  );

  await app.listen(3000, () => {
    console.log('Service start on http://localhost:3000/api');
    console.log('Swagger start on http://localhost:3000/docs');
  });
}
bootstrap();
