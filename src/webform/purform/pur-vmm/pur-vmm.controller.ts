import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { PurVmmService } from './pur-vmm.service';
import { CreatePurVmmDto } from './dto/create-pur-vmm.dto';
import { UpdatePurVmmDto } from './dto/update-pur-vmm.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('purform/pur-vmm')
export class PurVmmController {
    constructor(private readonly purVmmService: PurVmmService) {}

    @Post('createauto')
    async createauto(@Body() formEva: FormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return await this.purVmmService.createauto(formEva, ip);
    }

    // Temporary endpoint for starting purposes
    @Get('initial')
    @UseTransaction('webformConnection')
    initForm() {
        return this.purVmmService.initForm();
    }
}
