import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common'
import { SpeakerService } from './speaker.service'
import { CreateSpeakerDto } from './dto/create-speaker.dto'
import { REST } from 'src/enum'

@Controller('speaker')
export class SpeakerController {
  constructor(private readonly speakerService: SpeakerService) {}

  @Post(`${REST.W}/create`)
  async create(@Body() createSpeakerDto: CreateSpeakerDto, @Req() req, @Res() res) {
    try {
      const speaker = await this.speakerService.create(createSpeakerDto, req.user.id, req.user.dirname)
      res.status(200).send(speaker)
    } catch (error) {
      res.status(400).send('创建 Speaker 失败:' + error.message)
    }
  }

  @Get(`${REST.R}`)
  async findAll(@Req() req, @Res() res) {
    try {
      const speakers = await this.speakerService.findAll(req.user.id, req.user.dirname)
      res.status(200).send(speakers)
    } catch (error) {
      res.status(400).send('获取 Speakers 失败:' + error.message)
    }
  }

  @Delete(`${REST.D}/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      await this.speakerService.remove(id, req.user.id)
      res.status(200).send('删除 Speaker 成功')
    } catch (error) {
      res.status(400).send('删除 Speaker 失败:' + error.message)
    }
  }

  @Get(`${REST.R}/test/:role`)
  async testTts(@Param('role') role: number, @Req() req, @Res() res) {
    try {
      const filepath = await this.speakerService.testTts(Number(role))
      const url = '/public' + filepath.split('public')[1]
      res.status(200).send(url)
    } catch (error) {
      res.status(400).send('测试语音合成失败:' + error.message)
    }
  }

  @Post(`${REST.D}/temp`)
  async clearTemp(@Body() dto: { url: string }, @Req() req, @Res() res) {
    try {
      await this.speakerService.clearTemp(dto.url)
      res.status(200).send('成功删除临时音频文件')
    } catch (error) {
      res.status(400).send('删除临时音频文件失败')
    }
  }
}
