import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { FragmentService } from './fragment.service'
import { CreateTTSFragmentDto } from './dto/create-tts-fragment.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { CreateASRFragmentDto } from './dto/create-asr-fragment.dto'
import { REST } from 'src/enum'
import { FileInterceptor } from '@nestjs/platform-express'
import { ObjectId } from 'mongodb'
import {
  RemoveFragmentDto,
  RestoreFragmentDto,
  DeleteFragmentDto,
  UpdateTranscriptDto,
  AddPromoterDto,
  RemovePromoterDto,
  UpdateSequenceDto,
  UpdateFragmentsTagsDto
} from './dto/update-fragment.dto'
import { CreateBlankFragmentDto } from './dto/create-blank-fragment.dto copy'
import { CopyFragmentDto } from './dto/copy-fragment'

@UseGuards(AuthGuard('jwt'))
@Controller('fragment')
@ApiTags('音频片段')
export class FragmentController {
  constructor(private readonly fragmentService: FragmentService) {}

  @Post(`${REST.W}/create/tts`)
  async createByText(@Body() createTTSFragmentDto: CreateTTSFragmentDto, @Req() req, @Res() res) {
    try {
      const fragment = await this.fragmentService.createByText(createTTSFragmentDto, req.user._id, req.user.dirname)
      // console.log(fragment.audio)
      const data = {
        id: fragment._id,
        audio: 'http://' + req.headers.host + '/public' + fragment.audio.split('public')[1],
        duration: fragment.duration,
        txt: fragment.txt,
        transcript: fragment.transcript,
        tags: fragment.tags,
        promoters: fragment.promoters,
        timestamps: fragment.timestamps,
        role: fragment.role,
        removed: fragment.removed
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Post(`${REST.W}/create/asr`)
  @UseInterceptors(FileInterceptor('audio'))
  async createByAudio(@UploadedFile() audio, @Body() formData: CreateASRFragmentDto, @Req() req, @Res() res) {
    try {
      const fragment = await this.fragmentService.createByAudio(
        {
          procedureId: new ObjectId(formData.procedureId),
          audio: audio.path,
          duration: formData.duration,
          role: formData.role
        },
        req.user._id,
        req.user.dirname
      )
      const data = {
        id: fragment._id,
        audio: 'http://' + req.headers.host + '/public' + fragment.audio.split('public')[1],
        duration: fragment.duration,
        txt: fragment.txt,
        transcript: fragment.transcript,
        tags: fragment.tags,
        promoters: fragment.promoters,
        timestamps: fragment.timestamps,
        role: fragment.role,
        removed: fragment.removed
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Post(`${REST.W}/create/blank`)
  async createBlank(@Body() dto: CreateBlankFragmentDto, @Req() req, @Res() res) {
    try {
      const fragment = await this.fragmentService.createBlank(dto, req.user._id, req.user.dirname)
      const data = {
        id: fragment._id,
        audio: 'http://' + req.headers.host + '/public' + fragment.audio.split('public')[1],
        duration: fragment.duration,
        txt: fragment.txt,
        transcript: fragment.transcript,
        tags: fragment.tags,
        promoters: fragment.promoters,
        timestamps: fragment.timestamps,
        role: fragment.role,
        removed: fragment.removed
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  // @Get(`${REST.R}/:id`)
  // async findFragments(@Param('id') id: string, @Req() req, @Res() res: Response) {
  //   this.fragmentService
  //     .findAll(new ObjectId(id), req.user._id, req.user.dirname)
  //     .then(data => {
  //       // console.log(data)
  //       const fragments = data.map(fragment => {
  //         return {
  //           id: fragment._id,
  //           audio: 'http://' + req.headers.host + '/public' + fragment.audio.split('public')[1],
  //           duration: fragment.duration,
  //           transcript: fragment.transcript,
  //           tags: fragment.tags,
  //           promoters: fragment.promoters,
  //           role: fragment.role,
  //           removed: fragment.removed
  //         }
  //       })
  //       res.status(200).send(fragments)
  //     })
  //     .catch(err => {
  //       res.status(400).send(err)
  //     })
  // }

  @Patch(`${REST.U}/transcript`)
  async updateTranscript(@Body() updateTranscriptDto: UpdateTranscriptDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.updateTranscript(updateTranscriptDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/tags`)
  async updateFragmentsTags(@Body() updateFragmentsTagsDto: UpdateFragmentsTagsDto, @Req() req, @Res() res) {
    try {
      // console.log(updateFragmentsTagsDto)
      await this.fragmentService.updateFragmentsTags(updateFragmentsTagsDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/remove`)
  async remove(@Body() removeFragmentDto: RemoveFragmentDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService
        .remove(removeFragmentDto, req.user._id)
        .then(updateAt => {
          // 注意：返回值不能是纯数字 ！！！
          res.status(200).send(updateAt)
        })
        .catch(err => {
          console.log(err)
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/restore`)
  async restore(@Body() restoreFragmentDto: RestoreFragmentDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.restore(restoreFragmentDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/delete`)
  async delete(@Body() deleteFragmentDto: DeleteFragmentDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.delete(deleteFragmentDto, req.user._id, req.user.dirname).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/promoter/add`)
  async addPromoter(@Body() addPromoterDto: AddPromoterDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.addPromoter(addPromoterDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/promoter/remove`)
  async removePromoter(@Body() removePromoterDto: RemovePromoterDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.removePromoter(removePromoterDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/sequence`)
  async updateSequence(@Body() updateSequenceDto: UpdateSequenceDto, @Req() req, @Res() res) {
    try {
      await this.fragmentService.updateSequence(updateSequenceDto, req.user._id).then(updateAt => {
        res.status(200).send(updateAt)
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/copy`)
  async copy(@Body() dto: CopyFragmentDto, @Req() req, @Res() res) {
    try {
      const result = await this.fragmentService.copy(dto, req.user._id, req.user.dirname)
      result.fragment.audio = 'http://' + req.headers.host + '/public' + result.fragment.audio.split('public')[1]
      result.fragment['id'] = result.fragment._id
      delete result.fragment._id
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      // const err = error as Error
      // if (typeof error === Error)
      res.status(400).send(error)
    }
  }
}
