import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppCommand {
  constructor(private readonly httpService: HttpService) {}

  private sleep = (msec: number) =>
    new Promise((resolve) => setTimeout(resolve, msec));

  @Command({
    command: 'exec',
  })
  async exec() {
    const call = async () => {
      await lastValueFrom(
        this.httpService.get(`http://localhost:3000`, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }),
      ).then(({ data }) => {
        console.log(data);
      });
    };
    await call();
  }
}
