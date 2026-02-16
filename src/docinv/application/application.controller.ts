import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './upload.config';

import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('docinv/application')
export class ApplicationController {
  constructor(private readonly apps: ApplicationService) {}

  @Get()
  findAll() {
    return this.apps.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.apps.getAppsByID(+id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateApplicationDto,
  ) {
    if (files) {
      files.map((file) => {
        const type = file.originalname.split('-');
        if (type[0] == 'icon') body = { ...body, APP_ICON: file.filename };
        if (type[0] == 'poster') body = { ...body, APP_POSTER: file.filename };
      });
    }
    return this.apps.create(body);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  update(
    @Param('id') id: string,
    @Body() body: UpdateApplicationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files) {
      files.forEach((file) => {
        const filelocation = process.env.ITADMIN_HOST;
        const type = file.originalname.split('-');
        if (type[0] === 'icon')
          body = { ...body, APP_ICON: `${filelocation}/${file.filename}` };
        if (type[0] === 'poster')
          body = { ...body, APP_POSTER: `${filelocation}/${file.filename}` };
      });
    }
    return this.apps.update(+id, body);
  }
}
