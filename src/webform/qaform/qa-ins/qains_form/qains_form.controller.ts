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
} from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Request } from 'express';

import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

import { getClientIP } from 'src/common/utils/ip.utils';
import { QcConfQainsFormDto } from './dto/qcConfirm-qains_form.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import {
    ReturnQainsFormDto,
    setInchargeQainsFormDto,
} from './dto/return-qains_form.dot';
import { QainsFormCreateService } from './qains_form-create.service';
import { QainsFormSetInchargeService } from './qains_form-setIncharge.sevice';
import { QainsFormQcConfirmService } from './qains_form-qcConfirm.service';
import { QainsFormLastApproveService } from './qains_form-last-approve.service';
import { QainsFormReturnService } from './qains_form-return.service';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';

@ApiTags('QA-INS Form')
@Controller('qaform/qa-ins')
export class QainsFormController {
    constructor(
        private readonly qainsFormService: QainsFormService,
        private readonly createService: QainsFormCreateService,
        private readonly setInchargeService: QainsFormSetInchargeService,
        private readonly qcConfirmService: QainsFormQcConfirmService,
        private readonly lastApproveService: QainsFormLastApproveService,
        private readonly returnService: QainsFormReturnService,
    ) {}

    private readonly path = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/QA/QAINS/`;

    @ApiExcludeEndpoint()
    @Post('request')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('files', true, 20))
    async uploadUserFile(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreateQainsFormDto,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.createService.createQainsForm(dto, files, ip, this.path);
    }

    @Post('setIncharge')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(AnyFilesInterceptor())
    async setIncharge(
        @Body() dto: setInchargeQainsFormDto,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return await this.setInchargeService.setIncharge(dto, ip);
    }

    @Post('getFormData')
    async getFormData(@Body() dto: FormDto) {
        return await this.qainsFormService.getFormData(dto);
    }

    @Post('search')
    async search(@Body() dto: SearchQainsFormDto) {
        return await this.qainsFormService.search(dto);
    }

    @Post('qcConfirm')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(AnyFilesInterceptor())
    async qcConfirm(@Body() dto: QcConfQainsFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return await this.qcConfirmService.qcConfirm(dto, ip);
    }

    @Post('lastApprove')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(AnyFilesInterceptor())
    async lastApprove(@Body() dto: doactionFlowDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return await this.lastApproveService.lastApprove(dto, ip);
    }

    @Post('returnApproval')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('files', true, 20))
    async returnApproval(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: ReturnQainsFormDto,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return await this.returnService.returnApproval(
            dto,
            files,
            ip,
            this.path,
        );
    }
}
