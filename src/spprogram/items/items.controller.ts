import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UnsupportedMediaTypeException,
  UploadedFiles,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

import { createItemsDto } from './dto/createItems.dto';
import { searchItemsDto } from './dto/searchItems.dto';
import { updateItemsDto } from './dto/updateItems.dto';

@Controller('sp/items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  @Post('search')
  findItems(@Body() data: searchItemsDto) {
    return this.items.findAll(data);
  }

  @Post('finitem')
  findFinItems(@Body() data: searchItemsDto) {
    data.CATEGORY = 99;
    return this.items.findAll(data);
  }

  @Post('create')
  create(@Body() data: createItemsDto) {
    return this.items.createItems(data);
  }

  @Post('update')
  updateItems(@Body() data: updateItemsDto) {
    return this.items.updateItems(data);
  }

  @Post('photo/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = `${process.env.SP_FILE_PATH}/directsales/`;
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/*'];
        const isMimeTypeAllowed = allowedMimeTypes.some((mimePattern) => {
          const regex = new RegExp(`^${mimePattern.replace('*', '.*')}$`);
          return regex.test(file.mimetype);
        });
        if (!isMimeTypeAllowed) {
          return cb(
            new UnsupportedMediaTypeException('File type not supported!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
      },
    }),
  )
  attachFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: updateItemsDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    files.map((file) => {
      body = { ...body, ITEM_THUMB: file.filename };
      this.items.updateItems(body);
    });

    return { message: 'Files uploaded successfully', files };
  }

  @Get('photo/:id')
  async getPhoto(@Body('id') id: number, @Body() res: Response) {
    const ds = await this.items.findAll({ ITEM_ID: id });
    const filePath = `${process.env.SP_FILE_PATH}/directsales/${ds[0].ITEM_THUMB}`;
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString('base64');
      const mimeType = `image/${extname(filePath).slice(1)}`;
      return `data:${mimeType};base64,${base64Data}`;
    } else {
      throw new BadRequestException('File not found.');
    }
  }
}
