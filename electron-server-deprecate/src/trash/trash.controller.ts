import { Controller, Get, Param, UseGuards, Req, Res } from '@nestjs/common'
import { TrashService } from './trash.service'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { TrashName } from './dto/trash-name'

@UseGuards(AuthGuard('jwt'))
@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get(`${REST.R}/:trash`)
  async findAll(@Param('trash') trashName: TrashName, @Req() req, @Res() res) {
    try {
      const result = await this.trashService.findAll(trashName, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
