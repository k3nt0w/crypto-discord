import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AppCommand } from './app.command.spec';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule, CommandModule],
  controllers: [AppController],
  providers: [AppService, AppCommand],
})
export class AppModule {}
