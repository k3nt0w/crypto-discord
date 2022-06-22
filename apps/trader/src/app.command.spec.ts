import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { environment } from './environment'
import * as crypto from 'crypto'

@Injectable()
export class AppCommand {
  URL_BASE = 'https://coincheck.com'
  PATH_TICKER = '/api/ticker'
  PATH_ORDERS = '/api/exchange/orders'
  PATH_OPENS = '/api/exchange/orders/opens'
  PATH_TRANSACTIONS = '/api/exchange/orders/transactions'
  PATH_BALANCE = '/api/accounts/balance'

  constructor(private readonly httpService: HttpService) {}

  private sleep = (msec: number) =>
    new Promise((resolve) => setTimeout(resolve, msec))

  private nonce = (): string => {
    const date = new Date()
    const time = date.getTime()
    return Math.floor(time / 1000).toString()
  }

  private getHeaders = (
    nonce: string,
    signature: string,
  ): Record<string, string | number> => {
    return {
      'ACCESS-KEY': environment.COINCHECK_ACCESS_KEY,
      'ACCESS-NONCE': nonce,
      'ACCESS-SIGNATURE': signature,
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }

  @Command({
    command: 'exec',
  })
  async exec() {
    await this.getTicker()
  }

  private sign = (
    nonce: string,
    url: string,
    body?: Record<string, string | number>,
  ): string => {
    let message = ''
    message = nonce + url
    if (body) message += JSON.stringify(body)
    const hmac = crypto.createHmac('sha256', environment.COINCHECK_SECRET_KEY)
    hmac.update(message)
    return hmac.digest('hex')
  }

  private getTicker = async () => {
    const nonce = this.nonce()
    const signature = this.sign(nonce, this.PATH_TICKER)
    const headers = this.getHeaders(nonce, signature)
    await lastValueFrom(
      this.httpService.get(`${this.URL_BASE}/${this.PATH_TICKER}`, {
        ...headers,
      }),
    ).then(({ data }) => {
      console.log(data)
    })
  }
}
