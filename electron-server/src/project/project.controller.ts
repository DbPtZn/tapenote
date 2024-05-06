import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { AuthGuard } from '@nestjs/passport'
import { LibraryEnum, REST } from 'src/enum'
import { UpdateTitleDto } from './dto/update-title.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateSidenoteContentDto } from './dto/update-sidenote-content.dto'

@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(`${REST.W}/create`)
  async create(@Body() dto: CreateProjectDto, @Req() req, @Res() res) {
    try {
      const project = await this.projectService.create(dto, req.user._id, req.user.dirname)
      /** 用于项目列表展示的数据 */
      const data = {
        id: project._id,
        folderId: project.folderId,
        title: project.title,
        content: project.content,
        abbrev: project.abbrev,
        updateAt: project.updateAt,
        createAt: project.createAt
      }
      res.status(201).send(data)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/:id`)
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const project = await this.projectService.findOne(id, req.user._id, req.user.dirname)
      switch (project.library) {
        case LibraryEnum.NOTE:
          //
          break
        case LibraryEnum.PROCEDURE:
          // 替换片段音频路径
          project.fragments = project.fragments.map(fragment => {
            fragment['id'] = fragment._id // 用于前端的 id
            fragment.audio = '/public' + fragment.audio.split('public')[1]
            return fragment
          }) as any
          break
        case LibraryEnum.COURSE:
          // 替换音频路径
          project.audio = '/public' + project.audio.split('public')[1] || ''
          break
      }
      res.status(200).send(project)
    } catch (error) {
      // TODO 错误处理的问题， 未处理的错误会阻塞程序运行
      // console.log(error)
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/title`)
  async updateTitle(@Body() updateTitleDto: UpdateTitleDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateTitle(updateTitleDto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/content`)
  async updateContent(@Body() updateContentDto: UpdateContentDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateContent(updateContentDto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/remove/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.remove(id, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/restore/:id`)
  async restore(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const [projectId, folderId] = id.split('&')
      const result = await this.projectService.restore(projectId, folderId, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/move`)
  async move(@Body() moveDto: { sourceId: string; folderId: string }, @Req() req, @Res() res) {
    try {
      const { sourceId, folderId } = moveDto
      const result = await this.projectService.move(sourceId, folderId, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Post(`${REST.W}/copy`)
  async copy(@Body() copyDto: { sourceId: string; folderId: string }, @Req() req, @Res() res) {
    try {
      const { sourceId, folderId } = copyDto
      const result = await this.projectService.copy(sourceId, folderId, req.user._id, req.user.dirname)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Delete(`${REST.D}/:id`)
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.delete(id, req.user._id, req.user.dirname)
      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Patch(`${REST.U}/sidenote/content`)
  async updateSidenoteContent(@Body() updateSidenoteContentDto: UpdateSidenoteContentDto, @Req() req, @Res() res) {
    try {
      const result = await this.projectService.updateSidenoteContent(updateSidenoteContentDto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }
}
