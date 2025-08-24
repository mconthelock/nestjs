import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Body,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { createAttDto } from './dto/create.dto';

@Controller('sp/attachments')
export class AttachmentsController {
  constructor(private readonly atth: AttachmentsService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = `${process.env.SP_FILE_PATH}/${req.body.INQ_NO}`;
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
        const allowedMimeTypes = [
          'image/*',
          'image/vnd.dwg',
          'text/*',
          'application/csv',
          'application/acad',
          'application/pdf',
          'application/msword',
          'application/vnd.ms-excel',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.*',
        ];
        const isMimeTypeAllowed = allowedMimeTypes.some((mimePattern) => {
          const regex = new RegExp(`^${mimePattern.replace('*', '.*')}$`);
          return regex.test(file.mimetype);
        });
        if (!isMimeTypeAllowed) {
          return cb(new BadRequestException('File type not supported!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
      },
    }),
  )
  async createFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: createAttDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    files.map((file) => {
      const data = {
        ...body,
        FILE_NAME: file.filename,
        FILE_ORIGINAL_NAME: file.originalname,
        FILE_SIZE: file.size,
        FILE_TYPE: extname(file.filename),
        FILE_STATUS: 1,
        FILE_OWNER: 'MAR',
        FILE_MAR_READ: 0,
        FILE_DES_READ: 0,
        FILE_CREATE_AT: new Date(),
        FILE_CREATE_BY: 'MAR',
      };
      this.atth.create(data);
    });

    // files จะเป็น array ของไฟล์ที่ถูกอัปโหลด
    const uploadedFileDetails = files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    return {
      message: 'Files uploaded successfully!',
      files: uploadedFileDetails,
      data: body,
    };
  }

  @Post('search')
  async findInqno(@Body() searchDto: any) {
    return await this.atth.findInqno(searchDto);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.atth.findOne(id);
    if (!file) {
      throw new BadRequestException('File not found');
    }

    const filePath = `${process.env.SP_FILE_PATH}/${file.INQ_NO}/${file.FILE_NAME}`;
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found on disk');
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.FILE_ORIGINAL_NAME}`,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    return res.sendFile(filePath);
  }

  @Post('export/template')
  async exportTemplate(@Body() body: any, @Res() res: Response) {
    const filePath = `${process.env.SP_FILE_PATH}template/${body.name}`;
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found on disk');
    }

    const fileContent = fs.readFileSync(filePath);
    const base64String = fileContent.toString('base64');

    return res.json({
      filename: body.name,
      content: base64String,
    });
  }
}
