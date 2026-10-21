import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PurPraService } from '../services/pur-pra.service';
import { PurPraCreateService } from '../services/pur-pra-create-form.service';
import { Get } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { CreatePurPraFormDto } from '../dto/create-pur-pra-form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('purform/pur-pra')
export class PurPraController {
    constructor(
        private readonly service: PurPraService,
        private readonly createService: PurPraCreateService,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลคณะกรรมการทั้งหมด
     * @returns
     */
    @Get('committees')
    getCommittees() {
        return this.service.getCommittees();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลกลุ่มทั้งหมด
     * @returns
     */
    @Get('groups')
    getGroups() {
        return this.service.getGroups();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม COST_UP
     * @returns
     */
    @Get('reasons/costup')
    getCostupReasons() {
        return this.service.getReasonsByGroup('COST_UP');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม COST_DOWN
     * @returns
     */
    @Get('reasons/costdown')
    getCostdownReasons() {
        return this.service.getReasonsByGroup('COST_DOWN');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม BASIC_COND_REVISE
     * @returns
     */
    @Get('reasons/condition-revise')
    getConditionReviseReasons() {
        return this.service.getReasonsByGroup('BASIC_COND_REVISE');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม ESTIMATED_PRICE
     * @returns
     */
    @Get('reasons/estimate-price')
    getEstimatePriceReasons() {
        return this.service.getReasonsByGroup('ESTIMATED_PRICE');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-12
     * @description สร้างแบบฟอร์ม Price Approval
     * @param dto ข้อมูลแบบฟอร์ม
     * @param req ข้อมูลคำขอ HTTP
     * @param files ไฟล์ที่อัปโหลด
     * @returns ผลลัพธ์การสร้างแบบฟอร์ม
     */
    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(
        @Body() dto: CreatePurPraFormDto,
        @Req() req: Request,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const ip = getClientIP(req);
        return this.createService.create(dto, files, ip);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-13
     * @description ดึงข้อมูลแบบฟอร์ม Price Approval
     * @param form ข้อมูลแบบฟอร์มสำหรับการค้นหา
     * @returns ผลลัพธ์การค้นหาแบบฟอร์ม Price Approval
     */
    @Post('form')
    getPurPraForms(@Body() form: FormDto) {
        return this.service.getPurPraForms(form);
    }
}
