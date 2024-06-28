import { Controller, Post, UseInterceptors, UploadedFile, Req, Res, UseGuards, Body } from '@nestjs/common'
import { UploadService } from './upload.service'
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(`/img`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImg(@UploadedFile() file, @Body() formData, @Req() req, @Res() res) {
    try {
      // console.log(file)
      // console.log(formData.dirname) // 暂不考虑该方案
      const filePath = await this.uploadService.uploadImage({
        sourcePath: file.path,
        extname: extname(file.originalname),
        dirname: req.user.dirname,
        userId: req.user.id
      })
      const path = '/public' + (filePath as string).split('public')[1]
      // console.log(path)
      res.status(200).send(path)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
