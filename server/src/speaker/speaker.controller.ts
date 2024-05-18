import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpeakerService } from './speaker.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';

@Controller('speaker')
export class SpeakerController {
  constructor(private readonly speakerService: SpeakerService) {}

  @Post()
  create(@Body() createSpeakerDto: CreateSpeakerDto) {
    return this.speakerService.create(createSpeakerDto);
  }

  @Get()
  findAll() {
    return this.speakerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.speakerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpeakerDto: UpdateSpeakerDto) {
    return this.speakerService.update(+id, updateSpeakerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.speakerService.remove(+id);
  }
}
