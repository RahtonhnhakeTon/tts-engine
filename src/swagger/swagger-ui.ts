import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export class SwaggerUI {
  private customSiteTitle = 'API Documentation';
  private readonly assetPath = this.applicationUrl + '/public/swagger';
  private nestLogo = 'nestjs.png';
  private appLogo = 'app-logo.png';
  private acefoneLogo = 'acefone.png';
  private theme = new SwaggerTheme();

  private swaggerOptions = {
    persistAuthorization: true,
  };
  private customCss = this.theme.getBuffer(SwaggerThemeNameEnum.DRACULA).concat(
    `
    .swagger-ui .topbar .topbar-wrapper { content: url('${this.assetPath}/images/${this.appLogo}'); height: auto; width: 69px; }) }
    .swagger-ui .topbar .topbar-wrapper svg { visibility: hidden; }
    .swagger-ui .opblock-tag small { color: #83879 }
    `,
  );

  public customOptions = {
    customfavIcon: this.assetPath + '/images/' + this.acefoneLogo,
    customSiteTitle: this.customSiteTitle,
    customCss: this.customCss,
    // customCssUrl: this.assetPath + '/css/app.css',
    swaggerOptions: this.swaggerOptions,
  };

  constructor(private readonly applicationUrl: string) {}
}
