import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { IsCboService } from './is-cbo.service';
import { CreateIsCboDto } from './dto/create-is-cbo.dto';
import { UpdateIsCboDto } from './dto/update-is-cbo.dto';

@Controller('is-cbo')
export class IsCboController {
    constructor(private readonly isCboService: IsCboService) {}

    @Post('get-list-bring-out')
    getListBringOut(@Body('empno') vreqno: string) {
        return this.isCboService.getListBringOut(vreqno);
    }

    @Post('get-device')
    getDevice(@Body('uid') uid: string) {
        return this.isCboService.getDevice(uid);
    }

    @Post('save-log')
    saveLog(
        @Body('comname') comname: string,
        @Body('empno') empno: string
    ) {
        return this.isCboService.saveLog(comname, empno);
    }
}
