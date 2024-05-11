import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Session, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { Response, Request } from 'express'
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { CreateUserDto } from 'src/user/dto/_api'

// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`${REST.W}/register`)
  register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      console.log(createUserDto)
      this.authService
        .register(createUserDto)
        .then(user => {
          res.status(201).send({ id: user.id })
        })
        .catch(error => {
          console.log(error)
          res.status(400).send({ msg: '用户注册失败', error: error })
        })
    } catch (error) {
      res.status(400).send({ msg: '用户注册失败', error: error })
    }
  }

  /** 登录请求 */
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post(`${REST.R}/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res: Response) {
    // console.log(loginDto)
    // console.log('验证码：' + this.authService.validateCode(loginDto.code, loginDto.hashCode))
    // if (!this.authService.validateCode(loginDto.code, loginDto.hashCode)) return res.status(400).send('验证码错误！')
    const token = await this.authService.login(req.user)
    if (token) {
      res.status(200).send(token)
    } else {
      res.status(401).send('登录验证失败')
    }
  }

  @Post(`${REST.W}/dir/:id`)
  async createUserRoot(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      this.authService
        .createUserRoot(id)
        .then(msg => {
          res.status(200).send(msg)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      throw error
    }
  }

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
