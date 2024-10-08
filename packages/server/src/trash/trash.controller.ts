import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common'
import { TrashService } from './trash.service'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { TrashName } from './dto/trash-name'

@UseGuards(AuthGuard('jwt'))
@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get(`${REST.R}/:trash`)
  findAll(@Param('trash') trashName: TrashName, @Req() req) {
    return this.trashService.findAll(trashName, req.user.id)
  }
}
