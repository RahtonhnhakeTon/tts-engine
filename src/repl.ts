import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = await repl(AppModule, { useGlobal: true });
  server.setupHistory(process.env.NODE_REPL_HISTORY, (err) => {
    console.log(err);
  });
}
bootstrap();
