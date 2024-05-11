import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common'
import { BgmService } from './bgm.service'
import { AddBgmDto } from './dto/create-bgm.dto'
import { REST } from 'src/enum'

@Controller('bgm')
export class BgmController {
  constructor(private readonly bgmService: BgmService) {}

  @Post(`${REST.U}`)
  create(@Body() addBgmDto: AddBgmDto, @Req() req, @Res() res) {
    return this.bgmService.add(addBgmDto, req.user.id, req.user.dirname)
  }

  @Get(`${REST.R}`)
  findAll(@Req() req, @Res() res) {
    return this.bgmService.findAll(req.user.id, req.user.dirname)
  }

  @Delete(`${REST.D}/:id`)
  remove(@Param('id') id: string, @Req() req, @Res() res) {
    return this.bgmService.remove(id, req.user.id, req.user.dirname)
  }
}
