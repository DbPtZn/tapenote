import { Controller, Get, Post, Body, Res, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/user/dto/_api'
import { ConfigService } from '@nestjs/config'
import { getRealIp } from './utils/getRealIp'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post(`/register`)
  register(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      // console.log(createUserDto)
      this.authService
        .register(createUserDto)
        .then(user => {
          res.status(201).send({ id: user.id })
        })
        .catch(error => {
          console.log(error)
          res.status(400).send(error.message)
        })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  /** 登录请求 */
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post(`/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    // console.log(loginDto)
    // console.log('验证码：' + this.authService.validateCode(loginDto.code, loginDto.hashCode))
    // if (!this.authService.validateCode(loginDto.code, loginDto.hashCode)) return res.status(400).send('验证码错误！')
    const token = await this.authService.login(req.user)
    if (token) {
      res.status(200).send({ type: 'server', token })
    } else {
      res.status(401).send('登录验证失败')
    }
  }

  @Get(`/identify`)
  async identify(@Req() req, @Res() res) {
    try {
      const ip = getRealIp(req)
      const authorization = req.headers.authorization.substring(7).trim()
      const token = await this.authService.identify(authorization, ip)
      // console.log(`token:`, token)
      res.status(200).send({ type: 'server', token })
    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`/refresh`)
  async refreshToken(@Req() req, @Res() res) {
    try {
      // console.log(`/refresh`)
      const token = await this.authService.refreshToken(req.user.id)
      res.status(200).send({ type: 'server', token: token })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }


  // @Post(`${REST.W}/dir/:id`)
  // async createUserRoot(@Param('id') id: string, @Req() req, @Res() res) {
  //   try {
  //     this.authService
  //       .createUserRoot(id)
  //       .then(msg => {
  //         res.status(200).send(msg)
  //       })
  //       .catch(err => {
  //         res.status(400).send(err)
  //       })
  //   } catch (error) {
  //     throw error
  //   }
  // }

  /** 获取验证码请求 */
  // @Get(`${REST.R}/code`)
  // createCode(@Res() res: any) {
  //   const captcha = this.authService.generateCode()
  //   res.type('image/svg+xml')
  //   res.send({
  //     svg: captcha.data,
  //     hashCode: captcha.text
  //   })
  // }

  // @Post(`${REST.R}/login/:ssoToken`)
  // async login(@Param('ssoToken') ssoToken: string, @Req() req, @Res() res: Response) {
  //   try {
  //     // console.log(ssoToken)
  //     // 1.通过 sso 进行登录，获取用户权限
  //     const sso_res = await this.authService.login(ssoToken)
  //     // console.log(sso_res.data)
  //     if (sso_res.status === 200) {
  //       // 2.根据用户数据生成本地业务服务系统的 token
  //       const accessToken = await this.authService.genToken(sso_res.data)
  //       // console.log(accessToken)
  //       res.status(200).send(accessToken)
  //     } else {
  //       res.status(401).send('登录验证失败!')
  //     }
  //   } catch (error) {
  //     res.status(401).send(error)
  //   }
  // }
}
