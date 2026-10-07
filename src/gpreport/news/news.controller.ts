import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('gpreport/news')
export class NewsController {
    constructor(private readonly news: NewsService) {}

    @Get()
    getAvailable() {
        return this.news.getAvailable();
    }

    @Get('all')
    getAll() {
        return this.news.findAll();
    }

    @Get('image/:id/:type')
    async getNewsImage(@Param('id') id: string, @Param('type') type: string) {
        const data = await this.news.findOne(+id);
        if (!data) throw new BadRequestException('News not found');

        const image = await this.news.fileNewsImage(
            type == '1' ? data.NEWS_IMG : data.NEWS_HEADER,
        );
        if (!image) throw new BadRequestException('Image not found');
        return image;
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'coverImage', maxCount: 1 },
                { name: 'headerImage', maxCount: 1 },
                { name: 'attachments', maxCount: 10 },
            ],
            {
                storage: diskStorage({
                    destination: `${process.env.GP_FILE_PATH}/news/attachments`,
                    filename: (req, file, cb) => {
                        const uniqueSuffix =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const newFilename = `${uniqueSuffix}${ext}`;
                        cb(null, newFilename);
                    },
                }),
            },
        ),
    )
    async create(
        @UploadedFiles()
        files: {
            coverImage?: Express.Multer.File[];
            headerImage?: Express.Multer.File[];
            attachments?: Express.Multer.File[];
        },
        @Body() createNewsDto: CreateNewsDto,
    ) {
        const coverImage = await this.news.saveWebp(files.coverImage?.[0]);
        const headerImage = await this.news.saveWebp(files.headerImage?.[0]);
        if (coverImage) createNewsDto.NEWS_IMG = coverImage;
        if (headerImage) createNewsDto.NEWS_HEADER = headerImage;

        const news = await this.news.create(createNewsDto);

        for (const file of files.attachments || []) {
            await this.news.createAttachments({
                NEWS: news.NEWS_ID,
                FILE_NAME: file.filename,
                FILE_FNAME: file.originalname,
            });
        }
        return news;
    }

    @Patch()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'coverImage', maxCount: 1 },
                { name: 'headerImage', maxCount: 1 },
                { name: 'attachments', maxCount: 10 },
            ],
            {
                storage: diskStorage({
                    destination: `${process.env.GP_FILE_PATH}/news/attachments`,
                    filename: (req, file, cb) => {
                        const uniqueSuffix =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const newFilename = `${uniqueSuffix}${ext}`;
                        cb(null, newFilename);
                    },
                }),
            },
        ),
    )
    async update(
        @UploadedFiles()
        files: {
            coverImage?: Express.Multer.File[];
            headerImage?: Express.Multer.File[];
            attachments?: Express.Multer.File[];
        },
        @Body() updateNewsDto: UpdateNewsDto,
    ) {
        const deletedFiles = Array.isArray(updateNewsDto.deletedFiles)
            ? updateNewsDto.deletedFiles
            : JSON.parse(updateNewsDto.deletedFiles || '[]');

        for (const file of deletedFiles) {
            await this.news.removeAttachment(file);
        }
        const coverImage = await this.news.saveWebp(files.coverImage?.[0]);
        const headerImage = await this.news.saveWebp(files.headerImage?.[0]);
        if (coverImage) updateNewsDto.NEWS_IMG = coverImage;
        if (headerImage) updateNewsDto.NEWS_HEADER = headerImage;

        const news = await this.news.update(updateNewsDto);
        return news;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.news.remove(id);
    }
}
