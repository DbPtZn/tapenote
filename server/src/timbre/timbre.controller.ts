import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common'
import { TimbreService } from './timbre.service'
import { AddRobotDto, AddRoleDto } from './dto/create-timbre.dto'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'

@UseGuards(AuthGuard('jwt'))
@Controller('timbre')
export class TimbreController {
  constructor(private readonly timbreService: TimbreService) {}

  @Post(`${REST.U}/role`)
  async addRole(@Body() addRoleDto: AddRoleDto, @Req() req, @Res() res) {
    const timbre = await this.timbreService.addRole(addRoleDto, req.user._id)
    if (timbre) {
      return res.status(200).send({ message: 'success' })
    } else {
      return res.status(400).send({ message: 'error' })
    }
  }

  @Post(`${REST.U}/robot`)
  async addRobot(@Body() addRobotDto: AddRobotDto, @Req() req, @Res() res) {
    const timbre = await this.timbreService.addRobot(addRobotDto, req.user._id)
    if (timbre) {
      return res.status(200).send({ message: 'success' })
    } else {
      return res.status(400).send({ message: 'error' })
    }
  }

  @Get(`${REST.R}`)
  async findAll(@Req() req, @Res() res) {
    const timbre = await this.timbreService.findAll(req.user._id, req.user.dirname)
    timbre.roleList.forEach((role, key) => {
      if (role.value.avatar) {
        role.value.avatar = 'http://' + req.headers.host + '/public' + role.value.avatar.split('public')[1]
      }
    })
    timbre.robotList.forEach((role, key) => {
      if (role.value.avatar) {
        role.value.avatar = 'http://' + req.headers.host + '/public' + role.value.avatar.split('public')[1]
      }
    })
    delete timbre.userId
    delete timbre._id
    // console.log(timbre)
    return res.status(200).send(timbre)
  }

  @Delete(`${REST.D}/:value`)
  async remove(@Param('value') value: string, @Req() req, @Res() res) {
    const [type, key] = value.split('&')
    if (type !== 'role' && type !== 'robot') return res.status(400).send({ message: 'type error' })
    const result = await this.timbreService.remove(type, Number(key), req.user._id, req.user.dirname)
    if (result) return res.status(200).send({ message: 'success' })
    else return res.status(400).send({ message: '移除失败，未找到目标！' })
  }

  @Get(`${REST.R}/robot/test/:role`)
  async testRobot(@Param('role') role: number, @Req() req, @Res() res) {
    const filepath = await this.timbreService.testRobot(Number(role))
    const url = 'http://' + req.headers.host + '/public' + filepath.split('public')[1]
    res.status(200).send(url)
  }

  @Post(`${REST.D}/temp`)
  async clearTemp(@Body() dto: { url: string }, @Req() req, @Res() res) {
    try {
      await this.timbreService.clearTemp(dto.url)
      res.status(200).send('成功删除临时音频文件')
    } catch (error) {
      res.status(400).send('删除临时音频文件失败')
    }
  }
}
