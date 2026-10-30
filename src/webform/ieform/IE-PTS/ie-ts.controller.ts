import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    ParseArrayPipe,
    Put,
    Query,
    Req,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { getClientIP } from 'src/common/utils/ip.utils';
import {
    AutoInsertTsProcessDto,
    InsertTsProcessDto,
    TsFormKeyDto,
} from './dto/ts-process.dto';
import { IeTsService } from './ie-ts.service';

@ApiTags('IE TS process')
@Controller('ieform/ie-ts')
@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }),
)
export class IeTsController {
    constructor(private readonly service: IeTsService) {}

    @Post('insert_ts_process')
    insert(@Body() dto: InsertTsProcessDto) {
        return this.service.insert(dto);
    }

    @Post('auto_insert_ts_process')
    autoInsert(
        @Body(
            new ParseArrayPipe({
                items: AutoInsertTsProcessDto,
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        dtos: AutoInsertTsProcessDto[],
        @Req() req: Request,
    ) {
        return this.service.autoInsert(dtos, getClientIP(req));
    }

    @Get('get_ts_process')
    find(@Query() key: TsFormKeyDto) {
        return this.service.find(key);
    }

    @Put('update_ts_process')
    update(@Body() dto: InsertTsProcessDto) {
        return this.service.update(dto);
    }

    @Delete('delete_ts_process')
    remove(@Query() key: TsFormKeyDto) {
        return this.service.remove(key);
    }
}
