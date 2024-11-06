import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Query, ParseIntPipe, ParseEnumPipe } from '@nestjs/common'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { AuthGuard } from '@nestjs/passport'
import { LibraryEnum, REST } from 'src/enum'
import { UpdateTitleDto } from './dto/update-title.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateSidenoteContentDto } from './dto/update-sidenote-content.dto'
import { UpdateSpeakerHistoryDto } from './dto/update.dto'
import { AddSubmissionHistoryDto } from './dto/add-submission.dts'
import { InputProjectDto } from './dto/input-project.dto'
import { AddMemoDto, DeleteMemoDto, UpdateMemoContentDto, UpdateMemoStateDto } from './dto/memo.dto'

@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(`${REST.W}/create`)
  async create(@Body() dto: CreateProjectDto, @Req() req, @Res() res) {
    try {
      const project = await this.projectService.create(dto, req.user.id, req.user.dirname)
      res.status(201).send(project)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/:id`)
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      // console.log(id)
      await this.projectService.checkAndCorrectFragmentSquence(id) // 确保片段顺序正确
      const project = await this.projectService.findOne(id, req.user.id, req.user.dirname)
      res.status(200).send(project)
    } catch (error) {
      // TODO 错误处理的问题， 未处理的错误会阻塞程序运行
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`/recent`)
  async getRecent(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('lib') lib: LibraryEnum,
    @Req() req,
    @Res() res
  ) {
    try {
      // console.log(skip, take, lib)
      const result = await this.projectService.findByUpdateAtDESC(skip, take, lib, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch(`${REST.U}/title`)
  async updateTitle(@Body() updateTitleDto: UpdateTitleDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateTitle(updateTitleDto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/content`)
  async updateContent(@Body() updateContentDto: UpdateContentDto, @Req() req, @Res() res) {
    try {
      console.log(req.user.role)
      const result = await this.projectService.updateContent(updateContentDto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/cover`)
  async updateCover(@Body() dto: { id: string, url: string }, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateCover(dto.id, dto.url, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/cover/position`)
  async updateCoverPosition(@Body() dto: { id: string, position: number }, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateCoverPosition(dto.id, dto.position, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/remove/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.remove(id, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/restore/:id`)
  async restore(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const [projectId, folderId] = id.split('&')
      const result = await this.projectService.restore(projectId, folderId, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/move`)
  async move(@Body() moveDto: { sourceId: string; folderId: string }, @Req() req, @Res() res) {
    try {
      const { sourceId, folderId } = moveDto
      const result = await this.projectService.move(sourceId, folderId, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Post(`${REST.W}/copy`)
  async copy(@Body() copyDto: { sourceId: string; folderId: string }, @Req() req, @Res() res) {
    try {
      const { sourceId, folderId } = copyDto
      const result = await this.projectService.copy(sourceId, folderId, req.user.id, req.user.dirname)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Delete(`${REST.D}/:id`)
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.delete(id, req.user.id, req.user.dirname)
      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  // @Patch(`${REST.U}/sidenote/content`)
  // async updateSidenoteContent(@Body() updateSidenoteContentDto: UpdateSidenoteContentDto, @Req() req, @Res() res) {
  //   try {
  //     const result = await this.projectService.updateSidenoteContent(updateSidenoteContentDto, req.user.id)
  //     res.status(200).send(result)
  //   } catch (error) {
  //     res.status(400).send(error)
  //   }
  // }

  @Patch(`${REST.U}/memo/add`)
  async addMemo(@Body() dto: AddMemoDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.addMemo(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }
  
  @Patch(`${REST.U}/memo/content`)
  async updateMemoContent(@Body() dto: UpdateMemoContentDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateMemoContent(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send()
    }
  }
  
  @Patch(`${REST.U}/memo/delete`)
  async deleteMemo(@Body() dto: DeleteMemoDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.deleteMemo(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send()
    }
  }
  
  @Patch(`${REST.U}/memo/state`)
  async updateMemo(@Body() dto: UpdateMemoStateDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateMemoState(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send()
    }
  }
  
  @Patch(`${REST.U}/speaker/history`)
  async updateSpeakerHistory(@Body() updateSpeakerHistoryDto: UpdateSpeakerHistoryDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateSpeakerHistory(updateSpeakerHistoryDto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/submission/add`)
  async addSubmissionHistory(@Body() addSubmissionHistoryDto: AddSubmissionHistoryDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.addSubmissionHistory(addSubmissionHistoryDto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/submission/remove/:target`)
  async removeSubmissionHistory(@Param('target') target: string, @Req() req, @Res() res) {
    try {
      const [id, key] = target.split('&')
      const result = await this.projectService.removeSubmissionHistory(id, key, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/relevant/:id`)
  async getRelevantProjects(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.findRelevantProjectsById(id, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/parent/:id`)
  async getParentProjects(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.findParentProjectsById(id, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Post(`${REST.W}/coverCourse`)
  async coverCourse(
    @Query('courseId') courseId: string,
    @Query('procedureId') procedureId: string,
    @Req() req, 
    @Res() res
  ) {
    try {
      const result = await this.projectService.coverCourse(courseId, procedureId, req.user.id, req.user.dirname)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Post(`${REST.W}/input`)
  async input(@Body() dto: InputProjectDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.input(dto, req.user.id, req.user.dirname)
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
