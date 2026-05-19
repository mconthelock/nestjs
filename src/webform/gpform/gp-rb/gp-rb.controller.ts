import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UploadedFiles,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    GpRbService,
    ShowCusstampGpRbService,
    ShowstampGpRbService,
} from './gp-rb.service';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateNamestampdto } from './dto/update-gp-rb.dto';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FormService } from 'src/webform/form/form.service';

@Controller('gpform/gp-rb')
export class GpRbController {
    constructor(private readonly gpRbServicee: GpRbService) {}

    @Get()
    findAll() {
        return this.gpRbServicee.findAll();
    }

    /*stampFormatGroup ถูกแก้ไขเข้ามาเพื่อจะเลือกข้อมูลไป insert เข้าตาราง */
    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor('otherAttachment'))
    create(
        @Body() dto: CreateGpRbDto,
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const ip = getClientIP(req);
        return this.gpRbServicee.create(dto, ip, file);
    }
}

// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Controller('gpform/showstamp-gp-rb')
export class ShowstampGpRbController {
    constructor(private readonly gpRbServicee: ShowstampGpRbService) {}

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno') fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: number,
    ) {
        return this.gpRbServicee.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Patch()
    @UseTransaction('webformConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ webformConnection
    @UseForceTransaction()
    update(
        @Body() dto: UpdateNamestampdto,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.gpRbServicee.doaction(dto, ip);
    }
}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
@Controller('gpform/showcusstamp-gp-rb')
export class ShowCusStampGpRbController {
    constructor(private readonly gpRbServicee: ShowCusstampGpRbService) {}

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno') fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: number,
    ) {
        return this.gpRbServicee.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }
}
