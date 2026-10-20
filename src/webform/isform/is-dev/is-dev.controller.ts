import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

import { IsDevService } from './is-dev.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { SearchIsDevDto } from './dto/search-is-dev.dto';
import { CreateIsDevDto } from './dto/create-is-dev.dto';

@ApiTags('IS-DEV')
@Controller('form/is/is-dev')
export class IsDevController {
    // private readonly path =
    //     `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURVMM/` as string;
    constructor(private readonly dev: IsDevService) {}

    // ISDEV_REQUEST
    @Post('search')
    search(@Body() dto: SearchIsDevDto) {
        return this.dev.search(dto);
    }

    @Post('create')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor())
    create(
        @Body() dto: CreateIsDevDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.dev.create(dto, files, ip);
    }

    // ISDEV_DEVELOPER: Set Developer
    @Post('assignment/add')
    async addDeveloper(@Body() dto: CreateDeveloperDto) {
        return this.dev.createDev(dto);
    }

    @Post('assignment/delete')
    async deleteDeveloper(@Body() dto: UpdateDeveloperDto) {
        return this.dev.deleteDev(dto);
    }

    //ISDEV_OBJECTIVE
    @Get('objective/all')
    @ApiOperation({
        summary: 'Get all Objective',
        description: 'Get all IS-DEV Objective',
    })
    findAllObjective() {
        return this.dev.findAllObjective();
    }

    //ISDEV_DEVICE
    @Get('device/all')
    @ApiOperation({
        summary: 'Get all IS Device list',
        description: 'Get all IS-DEV Device list',
    })
    findAllDevice() {
        return this.dev.findAllDeviceMst();
    }

    //LABORCOST
    @Get('laborcost/all')
    findAllLaborcost() {
        return this.dev.findAllLaborcost();
    }

    //Dev Category
    @Get('category/all')
    findAllCategory() {
        return this.dev.findAllCategory();
    }
}
