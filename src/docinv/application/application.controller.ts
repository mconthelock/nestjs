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
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
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
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'iconfile', maxCount: 10 },
            { name: 'posterfile', maxCount: 10 },
        ]),
    )
    create(
        @Body() body: CreateApplicationDto,
        @UploadedFiles()
        files: {
            iconfile?: Express.Multer.File[];
            posterfile?: Express.Multer.File[];
        },
    ) {
        return this.apps.create(body, files);
    }

    @Patch(':id')
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'iconfile', maxCount: 10 },
            { name: 'posterfile', maxCount: 10 },
        ]),
    )
    update(
        @Param('id') id: string,
        @Body() body: UpdateApplicationDto,
        @UploadedFiles()
        files: {
            iconfile?: Express.Multer.File[];
            posterfile?: Express.Multer.File[];
        },
    ) {
        return this.apps.update(+id, body, files);
    }
}
