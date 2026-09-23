<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 38e4fc7c (QA-CN)
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
<<<<<<< HEAD
import { HpoService } from './hpo.service';

@Controller('hpo')
export class HpoController {
    constructor(private readonly hpoService: HpoService) {}

    @Get()
    findAll() {
        return this.hpoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hpoService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hpoService.remove(+id);
    }
=======
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
=======
>>>>>>> 38e4fc7c (QA-CN)
import { HpoService } from './hpo.service';

@Controller('hpo')
export class HpoController {
    constructor(private readonly hpoService: HpoService) {}

    @Get()
    findAll() {
        return this.hpoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hpoService.findOne(+id);
    }

<<<<<<< HEAD
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hpoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHpoDto: UpdateHpoDto) {
    return this.hpoService.update(+id, updateHpoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hpoService.remove(+id);
  }
>>>>>>> 093c063b (QA-CN)
=======
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hpoService.remove(+id);
    }
>>>>>>> 38e4fc7c (QA-CN)
}
