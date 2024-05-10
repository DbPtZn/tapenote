import { Controller, Get, Body, Patch, Param, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto, UpdateUserSubmissionConfigDto, UpdateUserSubscriptionConfigDto } from './dto/_api'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { ApiTags } from '@nestjs/swagger'
import { UpdateUserPwdDto } from './dto/update-pwd.dto'

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post(`${REST.W}/create`)
  // create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
  //   try {
  //     this.userService.create(createUserDto).then(user => {
  //       res.status(201).send('笔记业务系统用户注册成功')
  //     })
  //   } catch (error) {
  //     res.status(400).send(error)
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/dir`)
  async getUserDir(@Req() req, @Res() res) {
    const dir = await this.userService.getDirById(req.user._id)
    if (!dir) {
      return res.status(401).send('权限不足，获取用户目录信息失败！')
    }
    return res.status(200).send(dir)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/info`)
  async getUserInfo(@Req() req, @Res() res) {
    try {
      const info = await this.userService.getInfoById(req.user._id, req.user.dirname)
      info.avatar = '/public' + info.avatar.split('public')[1]
      if (!info) {
        return res.status(400).send('权限不足，获取用户信息失败！')
      }
      return res.status(200).send(info)
    } catch (error) {
      return res.status(400).send('获取用户信息失败！' + error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/info`)
  async updateInfo(@Body() updateUserDto: UpdateUserDto, @Req() req, @Res() res) {
    console.log('更新用户数据：')
    console.log(updateUserDto)
    try {
      const updateAt = await this.userService.updateInfo(updateUserDto, req.user._id)
      res.status(200).send(updateAt)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/pwd`)
  async updatePwd(@Body() updateUserPwdDto: UpdateUserPwdDto, @Req() req, @Res() res) {
    console.log('更新用户密码：' + updateUserPwdDto)
    try {
      const updateAt = await this.userService.updatePwd(updateUserPwdDto, req.user._id)
      res.status(200).send(updateAt)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/submission/add`)
  async addSubmissionConfig(@Req() req, @Res() res) {
    try {
      const result = await this.userService.addSubmissionConfig(req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/submission/remove/:id`)
  async removeSubmissionConfig(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.userService.removeSubmissionConfig(id, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/submission/modify`)
  async updateSubmissionConfig(@Body() dto: UpdateUserSubmissionConfigDto, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateSubmissionConfig(dto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/subscription/add`)
  async addSubscriptionConfig(@Req() req, @Res() res) {
    try {
      const result = await this.userService.addSubscriptionConfig(req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/subscription/remove/:id`)
  async removeSubscriptionConfig(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.userService.removeSubscriptionConfig(id, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/subscription/modify`)
  async updateSubscriptionConfig(@Body() dto: UpdateUserSubscriptionConfigDto, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateSubscriptionConfig(dto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}
