import { SnapshotService } from './snapshot.service'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LibraryEnum, REST } from 'src/enum'

@UseGuards(AuthGuard('jwt'))
@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

  @Post(`${REST.W}/:id`)
  async create(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      // console.log(id)
      const snapshot = await this.snapshotService.create(id, req.user.id)
      // console.log(snapshot)
      res.status(201).send(snapshot)
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }

  @Get(`${REST.R}/:id`)
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const snapshot = await this.snapshotService.findOne(id, req.user.id)
      res.status(200).send(snapshot)
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }

  @Get(`${REST.R}/all/:id`)
  async findAll(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const snapshots = await this.snapshotService.findAll(id, req.user.id)
      // console.log(snapshots)
      res.status(200).send(snapshots)
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }

  @Post(`/apply`)
  async apply(
    @Query('projectId') projectId: string,
    @Query('snapshotId') snapshotId: string,
    @Req() req,
    @Res() res
  ) {
    try {
      if (!projectId || !snapshotId ) throw new Error('Invalid parameters')
      const result = await this.snapshotService.apply(projectId, snapshotId, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }

  @Delete(`${REST.D}/:id`)
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      if (!id) throw new Error('Invalid parameters')
      const result = await this.snapshotService.delete(id, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }
}
