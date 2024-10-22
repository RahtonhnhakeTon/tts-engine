import { repl } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
    await repl(AppModule, { useGlobal: true });
}
bootstrap();