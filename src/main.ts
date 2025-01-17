import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PORT } from 'src/utils'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Article Management API')
    .setDescription('API Docs - Article Management')
    .setVersion('1.0')
    .build()

  app.enableCors({
    origin: 'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api-docs', app, document)
  await app.listen(PORT)
}
bootstrap()
