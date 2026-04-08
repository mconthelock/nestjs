import { Controller, Get, Post, Body, Req, Patch } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { CreateIsTidFormDto } from './dto/create-is-tid.dto';
import { ActionIsTidDto } from './dto/update-is-tid.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { IsTidCreateFormService } from './is-tid-createForm.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { IsTidActionService } from './is-tid-updateForm.service';

@Controller('isform/is-tid')
export class IsTidController {
    constructor(
        private readonly isTidService: IsTidService,
        private readonly isTidCreateFormService: IsTidCreateFormService,
        private readonly isTidActionService: IsTidActionService,
    ) {}

    @Post('getFormData')
    async getFormData(@Body() dto: FormDto) {
        return this.isTidService.findOne(dto);
    }

    @Get()
    findAll() {
        return this.isTidService.findAll();
    }

    @Post('search')
    @UseTransaction('webformConnection')
    async search(@Body() dto: FiltersDto) {
        return this.isTidService.search(dto);
    }

    @Post()
    @UseTransaction('webformConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ webformConnection
    @UseForceTransaction()
    create(@Body() dto: CreateIsTidFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.isTidCreateFormService.handleCreate(dto, ip);
    }

    @Patch()
    @UseTransaction('webformConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ webformConnection
    @UseForceTransaction()
    update(@Body() dto: ActionIsTidDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.isTidActionService.actionForm(dto, ip);
    }
}
