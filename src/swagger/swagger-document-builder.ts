import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUI } from './swagger-ui';

const _SWAGGER_TAGS = [
  {
    name: 'App',
    description: 'hehe',
  },
];

export class SwaggerDocumentBuilder {
  constructor(
    private readonly app: INestApplication<any>,
    private readonly config: ConfigService,
  ) {}

  public setupSwagger() {
    const document = this.createDocument();
    const swaggerUI = new SwaggerUI(this.config.get<string>('app.url'));
    SwaggerModule.setup('/v1/doc', this.app, document, swaggerUI.customOptions);
  }

  private buildConfig() {
    const docBuilder = new DocumentBuilder()
      .setTitle('TTS Engine')
      .setDescription('APIs for the pluggable TTS adapter')
      .setVersion('1.0');

    _SWAGGER_TAGS.forEach((tag) => {
      docBuilder.addTag(tag.name, tag.description);
    });

    return docBuilder.build();
  }

  private createDocument() {
    const config = this.buildConfig();
    return SwaggerModule.createDocument(this.app, config);
  }
}
