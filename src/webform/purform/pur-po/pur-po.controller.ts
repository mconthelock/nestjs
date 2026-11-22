import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { PurPoService } from './pur-po.service';
import { CreatePurPoDraftDto } from './dto/create-purpo-draft.dto';
import { SubmitPurPoDto } from './dto/submit-purpo.dto';
import { BatchActionPurPoDto } from './dto/batch-action-purpo.dto';
import { RecreatePurPoDto } from './dto/recreate-purpo.dto';

@Controller('purform/pur-po')
export class PurPoController {
    constructor(private readonly purPoService: PurPoService) {}

    private assertInternalApiKey(apiKey?: string) {
        const expected =
            process.env.INTERNAL_API_KEY || 'amec-scm-internal-dev-key';
        if (!apiKey || apiKey !== expected) {
            throw new UnauthorizedException('Invalid internal API key');
        }
    }

    @Post('draft')
    @HttpCode(HttpStatus.CREATED)
    @UseTransaction('mitsuConnection')
    @UseForceTransaction()
    createDraft(
        @Body() dto: CreatePurPoDraftDto,
        @Headers('x-internal-api-key') apiKey: string,
        @Req() req: Request,
    ) {
        this.assertInternalApiKey(apiKey);
        return this.purPoService.createDraft(dto, getClientIP(req));
    }

    @Get('detail')
    getDetail(
        @Query('nfrmno') nfrmno: string,
        @Query('vorgno') vorgno: string,
        @Query('cyear') cyear: string,
        @Query('cyear2') cyear2: string,
        @Query('nrunno') nrunno: string,
    ) {
        return this.purPoService.getFormDetail({
            NFRMNO: Number(nfrmno),
            VORGNO: vorgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: Number(nrunno),
        });
    }

    @Get('pending')
    getPending(@Query('empno') empno: string) {
        return this.purPoService.getPendingForApprover(empno);
    }

    @Patch('submit')
    @UseTransaction('mitsuConnection')
    @UseForceTransaction()
    submit(@Body() dto: SubmitPurPoDto, @Req() req: Request) {
        return this.purPoService.submitForm(dto, getClientIP(req));
    }

    @Post('batch-action')
    @HttpCode(HttpStatus.OK)
    batchAction(@Body() dto: BatchActionPurPoDto, @Req() req: Request) {
        return this.purPoService.batchAction(dto, getClientIP(req));
    }

    @Post('recreate-from-rejected')
    @HttpCode(HttpStatus.CREATED)
    @UseTransaction('mitsuConnection')
    @UseForceTransaction()
    recreateFromRejected(@Body() dto: RecreatePurPoDto, @Req() req: Request) {
        return this.purPoService.recreateFromRejected(dto, getClientIP(req));
    }

    @Post('outbox/retry')
    @HttpCode(HttpStatus.OK)
    retryOutbox(@Headers('x-internal-api-key') apiKey: string) {
        this.assertInternalApiKey(apiKey);
        return this.purPoService.processPendingOutbox();
    }
}
