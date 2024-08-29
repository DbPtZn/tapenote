import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}
  @Get('date')
  getServerDate() {
    return Date.now()
  }

  @Get('/hello')
  getHello() {
    const ssoEnable = this.configService.get('common.ssoEnable') as boolean
    return ssoEnable
  }
}
