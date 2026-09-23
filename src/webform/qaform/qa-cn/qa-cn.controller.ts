import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFiles,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { QaCnService } from './qa-cn.service';
import { CreateQaCnDto } from './dto/create-qa-cn.dto';
import { UpdateQaCnDto } from './dto/update-qa-cn.dto';
import { RequestCNFormDto } from './dto/request-qa-cn.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { ApproveQaCnDto } from './dto/approve-qa-cn.dto';

@Controller('qaform/qa-cn')
export class QaCnController {
    constructor(private readonly qaCnService: QaCnService) {}
    private readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/QA/CN/` as string;
    @Post('create')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'DWGFILE[]', maxCount: 10 },
            { name: 'MATFILE[]', maxCount: 10 },
            { name: 'MAKFILE[]', maxCount: 10 },
            { name: 'ROHFILE[]', maxCount: 10 },
            { name: 'PURFILE[]', maxCount: 10 },
            { name: 'SUBFILE[]', maxCount: 10 },
            { name: 'CHKFILE[]', maxCount: 10 },
            { name: 'JUDFILE[]', maxCount: 10 },
        ]),
    )
    create(
        @Body() dto: RequestCNFormDto,
        @UploadedFiles()
        files: {
            'DWGFILE[]'?: Express.Multer.File[];
            'MATFILE[]'?: Express.Multer.File[];
            'MAKFILE[]'?: Express.Multer.File[];
            'ROHFILE[]'?: Express.Multer.File[];
            'PURFILE[]'?: Express.Multer.File[];
            'SUBFILE[]'?: Express.Multer.File[];
            'CHKFILE[]'?: Express.Multer.File[];
            'JUDFILE[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.qaCnService.request(dto, files, ip, this.path);
    }

    @Patch('approve')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'DWGFILE[]', maxCount: 10 },
            { name: 'MATFILE[]', maxCount: 10 },
            { name: 'MAKFILE[]', maxCount: 10 },
            { name: 'ROHFILE[]', maxCount: 10 },
            { name: 'PURFILE[]', maxCount: 10 },
            { name: 'SUBFILE[]', maxCount: 10 },
            { name: 'CHKFILE[]', maxCount: 10 },
            { name: 'JUDFILE[]', maxCount: 10 },
        ]),
    )
    approve(
        @Body() dto: ApproveQaCnDto, // หรือ RequestPurevaFormDto
        @UploadedFiles()
        files: {
            'DWGFILE[]'?: Express.Multer.File[];
            'MATFILE[]'?: Express.Multer.File[];
            'MAKFILE[]'?: Express.Multer.File[];
            'ROHFILE[]'?: Express.Multer.File[];
            'PURFILE[]'?: Express.Multer.File[];
            'SUBFILE[]'?: Express.Multer.File[];
            'CHKFILE[]'?: Express.Multer.File[];
            'JUDFILE[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.qaCnService.approve(dto, files, ip, this.path);
    }

    @Get()
    findAll() {
        return this.qaCnService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.qaCnService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQaCnDto: UpdateQaCnDto) {
        return this.qaCnService.update(+id, updateQaCnDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.qaCnService.remove(+id);
    }
}
