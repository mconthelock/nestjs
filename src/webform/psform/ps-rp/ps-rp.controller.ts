import { Body, Controller, Post, Req, UseInterceptors } from "@nestjs/common";
import { UseTransaction } from "src/common/decorator/transaction.decorator";
import { getClientIP } from "src/common/utils/ip.utils";
import { Request } from "express";
import { PsRPService } from "./ps-rp.service";
import { CreatePsrpReqFormDto } from "./dto/create-ps-rp.dto";
import { getFileUploadInterceptor } from "src/common/helpers/file-upload.helper";


@Controller('psform/ps-rp')
export class PsRPController{
    constructor(private readonly psRpService: PsRPService) {}

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatePsrpReqFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.psRpService.create(dto, ip);
    }
}