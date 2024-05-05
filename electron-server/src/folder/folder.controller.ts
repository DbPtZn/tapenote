import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common'
import { FolderService } from './folder.service'
import { CreateFolderDto } from './dto/create-folder.dto'
import { MoveFolderDto } from './dto/move-folder.dto'
import { LibraryEnum, REST } from 'src/enum'
import { AuthGuard } from '@nestjs/passport'
// import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetRecentlyDto } from './dto/get-recently.dto'

@UseGuards(AuthGuard('jwt'))
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post(`${REST.W}/create`)
  async create(@Body() createFolderDto: CreateFolderDto, @Req() req) {
    try {
      const folder = await this.folderService.create(createFolderDto, req.user._id)
      return {
        id: folder._id,
        name: folder.name,
        desc: folder.desc,
        lib: folder.lib,
        parentId: folder.parentId
      }
    } catch (error) {
      throw error
    }
  }

  @Get(`${REST.R}/tree/:lib`)
  findTree(@Param('lib') lib: LibraryEnum, @Req() req) {
    return null
    // return this.folderService.findTreeNodeByLib(lib, req.user._id)
  }

  @Get(`${REST.R}/children/:id`)
  findChildren(@Param('id') id: string, @Req() req) {
    return this.folderService.findChildrenById(id, req.user._id)
  }

  @Get(`${REST.R}/:id`)
  async findOne(@Param('id') id: string, @Req() req) {
    try {
      const folder = await this.folderService.getFolderData(id, req.user._id)
      return folder
    } catch (error) {
      throw error
    }
  }

  @Patch(`/${REST.U}/remove/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const result = await this.folderService.remove(id, req.user._id)
    res.send(result)
  }

  @Patch(`/${REST.U}/restore/:id`)
  async restore(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      console.log(id)
      const [folderId, parentId] = id.split('&')
      const result = await this.folderService.restore(folderId, parentId, req.user._id)
      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Patch(`/${REST.U}/move/folder`)
  async moveFolder(@Body() moveFolderDto: MoveFolderDto, @Req() req, @Res() res) {
    try {
      const result = await this.folderService.move(moveFolderDto, req.user._id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Patch(`/${REST.U}/rename/:id`)
  async rename(@Param('id') id: string, @Body() renameDto: { name: string }, @Req() req, @Res() res) {
    try {
      const { name } = renameDto
      const result = await this.folderService.rename(id, name, req.user._id)
      res.send(result)
    } catch (error) {
      // console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/query/exist/:id`)
  async queryExist(@Param('id') id: string, @Req() req, @Res() res) {
    const result = await this.folderService.queryExistById(id, req.user._id)
    res.status(200).send(result)
  }

  @Delete(`/${REST.D}/:id`)
  delete(@Param('id') id: string, @Req() req, @Res() res) {
    this.folderService
      .delete(id, req.user._id, req.user.dirname)
      .then(() => {
        res.send(true)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  }

  @Post(`${REST.R}/recently`)
  async findRecently(@Body() getRecentlyDto: GetRecentlyDto, @Req() req, @Res() res) {
    try {
      const data = await this.folderService.getRecently(getRecentlyDto, req.user._id)
      res.status(200).send(data)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/ancestor/:id`)
  async findAncestorNode(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const data = await this.folderService.findAncestorNode(id, req.user._id)
      res.status(200).send(data)
    } catch (error) {
      res.status(400).send(error)
    }
  }
}
